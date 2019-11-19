import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class StationDetailsComponent extends Component {

  @service('notification-service') notifications;

  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @computed('turnsLeft')
  get sufficientTurns() {
    return this.get('turnsLeft') >= this.get('station.travel_time');
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
