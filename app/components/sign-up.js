import Component from '@ember/component'
import { computed, get, observer, set } from '@ember/object'

export default Component.extend({

  elementId: 'sign-up',

  classNames: ['d-flex', 'flex-column', 'align-items-center', 'justify-content-center'],

  inputLength:  null,
  validInput:   false,

  invalidButtonText: computed('inputLength', function() {
    let inputLength = get(this, 'inputLength');

    if (inputLength === 1) {
      return "Needs more letters...";
    } else if (inputLength === 2) {
      return "Almost there...";
    } else {
      return null;
    }
  }),

  isConnected: observer('socket.gameChannel', function() {
    let channel = get(this, 'socket.gameChannel');

    if (channel) {
      get(this, 'sendJoin')();
    }
  }),

  evaluateNewCharInput() {
    set(this, 'inputLength', get(this, 'playerName').length);
  },

  actions: {

    validatePlayerName() {
      this.evaluateNewCharInput();

      if (get(this, 'playerName').length >= 3) {
        set(this, 'validInput', true);
      } else {
        set(this, 'validInput', false);
      }
    },

    createPlayer() {
      get(this, 'socket').connect({ name: get(this, 'playerName') });
    }

  }

})
