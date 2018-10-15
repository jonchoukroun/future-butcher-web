import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class MarketController extends Controller {

  @service('notification-service') notifications;

  @computed('socket.stateData.player.debt')
  get isInDebt() {
    return this.get('socket.stateData.player.debt') > 0;
  }

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
