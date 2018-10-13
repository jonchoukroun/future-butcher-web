import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';

import { subwayStations } from 'future-butcher-web/fixtures/subway-stations';

export default class SubwayController extends Controller {

  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @computed('turnsLeft')
  get isLastTurn() {
    return this.get('turnsLeft') === 0;
  }

  @computed()
  get cheapestEntry() {
    const hollywood_rate = subwayStations.filter(el =>
      el.name === "hollywood").get('firstObject.base_crime_rate');

    const next_turn = 25 - this.get('turnsLeft');
    const fee = (2 * (5 - hollywood_rate)) * Math.pow(next_turn, 2) - (100 * hollywood_rate) + 500
    return Math.round(fee);
  }

  @computed('socket.stateData.player.funds')
  get playerFunds() {
    return this.get('socket.stateData.player.funds');
  }

  @computed('socket.stateData.{player.pack,station.market}')
  get totalInventoryValue() {
    const pack = this.get('socket.stateData.player.pack');
    const market = this.get('socket.stateData.station.market');
    return Object.keys(pack).reduce((sum, cut) => {
      return sum + (pack[cut] * market[cut].price);
    }, 0);
  }

  @computed('playerFunds', 'totalInventoryValue')
  get totalPlayerValue() {
    return this.get('playerFunds') + this.get('totalInventoryValue');
  }

  @computed('socket.stateData.station.station_name', 'totalPlayerValue', 'cheapestEntry')
  get gameOverState() {
    if (this.get('socket.stateData.station.station_name') === 'compton') {
      return this.get('cheapestEntry') > this.get('totalPlayerValue');
    }

    return false;
  }

  endGame(payload, redirect) {
    this.get('socket').pushCallBack('end_game', payload).then(() => {
      this.transitionToRoute(redirect);
    });
  }

  @action
  sendToScores() {
    this.transitionToRoute('high-scores');
  }

  @action
  sendEndGame(payload) {
    this.endGame(payload, 'high-scores');
  }

  @action
  payDebt() {
    this.get('socket').pushCallBack("pay_debt", { amount: this.get('playerDebt') });
  }

  @action
  quitGame() {
    const payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };
    this.endGame(payload, 'high-scores');
  }

  @action
  startOver() {
    const payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };
    this.endGame(payload, 'home');
  }

  @action
  navigate(station) {
    const payload = { destination: station };
    this.get('socket').pushCallBack('change_station', payload).then(() => {
      this.transitionToRoute('traveling');
    });
  }

}
