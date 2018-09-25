import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
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
