import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({

  playerDebt: computed('socket.stateData.player.debt', function() {
    return get(this, 'socket.stateData.player.debt');
  }),

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

  actions: {
    selectStation() {
      get(this, 'selectStation')(get(this, 'station.name'));
    }
  }

});
