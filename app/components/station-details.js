import Component from '@ember/component';
import { computed, get, observer } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({

  notifications: service('notification-service'),

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

  storeOpen: observer('turnsLeft', 'socket.stateData.station.station_name', function() {
    let station_name = get(this, 'socket.stateData.station.station_name');
    if (get(this, 'turnsLeft') === 18 && station_name !== "venice_beach") {
      const message = "Gus's Army Surplus Store is now open in Venice Beach.";
      get(this, 'notifications').notifyConfirmation(message)
    }
  }),

  inventoryAdded: observer('turnsLeft', 'socket.stateData.station.station_name', function() {
    let station_name = get(this, 'socket.stateData.station.station_name');
    if (get(this, 'turnsLeft') === 12 && station_name !== "venice_beach") {
      const message = "Word on the street: Gus is now offering meat-hauling items.";
      get(this, 'notifications').notifyConfirmation(message)
    }
  }),

  entryFee: computed('turnsLeft', 'station.base_crimte_rate', function() {
    const crime_rate = get(this, 'station.base_crimte_rate');
    const next_turn = 25 - get(this, 'turnsLeft');
    let fee = (2 * (5 - crime_rate)) * Math.pow(next_turn, 2) - (100 * crime_rate) + 500
    return Math.round(fee);
  }),

  playerFunds: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  playerDebt: computed('socket.stateData.player.debt', function() {
    return get(this, 'socket.stateData.player.debt');
  }),

  actions: {
    selectStation() {
      get(this, 'selectStation')(get(this, 'station.name'));
    }
  }

});
