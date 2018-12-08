import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';

export default class MarketController extends Controller {

  @computed('socket.stateData.station.station_name')
  get currentStation() {
    return this.get('socket.stateData.station.station_name');
  }

  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @action
  reloadRoute() {
    this.transitionToRoute('market');
  }

  @action
  sendToScores() {
    this.transitionToRoute('high-scores');
  }

}
