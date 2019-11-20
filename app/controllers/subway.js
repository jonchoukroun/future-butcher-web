import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SubwayController extends Controller {

  helpScreenVisible = false;

  @service('tracking-service') trackingService;

  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @computed('turnsLeft')
  get isLastTurn() {
    return this.get('turnsLeft') === 0;
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

  endGame(payload, redirect) {
    this.get('socket').pushCallBack("end_game", payload).then(() => {
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

  @action
  toggleHelpScreen() {
    const helpVisibility = this.get('helpScreenVisible');
    this.set('helpScreenVisible', !helpVisibility);
    this.get('trackingService').trackEvent('Viewed help screen');
  }

}
