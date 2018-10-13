import Component from '@ember/component';
import { action, computed, observes } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class StationDetailsComponent extends Component {

  @service('notification-service') notifications;

  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @observes('turnsLeft', 'socket.stateData.station.station_name')
  storeOpen() {
    const station_name = this.get('socket.stateData.station.station_name');

    if (this.get('turnsLeft') === 18 && station_name !== "venice_beach") {
      const message = "Gus's Army Surplus Store is now open in Venice Beach.";
      this.get('notifications').pinNotification(message)
    }

    return;
  }

  @observes('turnsLeft', 'socket.stateData.station.station_name')
  inventoryAdded() {
    const station_name = this.get('socket.stateData.station.station_name');

    if (this.get('turnsLeft') === 12 && station_name !== "venice_beach") {
      const message = "Word on the street: Gus is now offering meat-hauling items.";
      this.get('notifications').pinNotification(message)
    }

    return;
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
