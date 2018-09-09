import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

});
