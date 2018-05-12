import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({

  phoenixChannel: service('phoenix-socket'),

  elementId: 'sign-up',

  classNames: ['container'],

  validInput: false,

  actions: {

    validatePlayerName() {
      if (get(this, 'playerName').length >= 3) {
        set(this, 'validInput', true);
      } else {
        set(this, 'validInput', false);
      }
    },

    createPlayer() {
      let payload = { name: get(this, 'playerName') };
      get(this, 'phoenixChannel').connect(payload);

      this.sendAction('sendJoin');
    }

  }

});
