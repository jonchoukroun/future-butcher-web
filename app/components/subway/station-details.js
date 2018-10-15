import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class StationDetailsComponent extends Component {

  @service('notification-service') notifications;

  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @computed('socket.stateData.player.funds')
  get playerFunds() {
    return this.get('socket.stateData.player.funds');
  }

  @computed('socket.stateData.player.debt')
  get playerDebt() {
    return this.get('socket.stateData.player.debt');
  }

  @action
  selectStation() {
    this.get('selectStation')(this.get('station.name'));
  }

}
