import Component from '@ember/component'
import { computed, get, set } from '@ember/object'

export default Component.extend({

  elementId: 'sign-up',

  classNames: ['d-flex', 'flex-column', 'align-items-center', 'justify-content-center'],

  socketUnavailable: false,      // temporary default, make conditional on socket open
  inputLength:       null,
  validInput:        false,

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
      const socketService = get(this, 'socket');
      const name = get(this, 'playerName');

      socketService.openSocket().catch(() => {
        set(this, 'socketUnavailable', true);
      }).then((socket) => {
        socketService.joinChannel(socket, { name: name }).then(() => {
          this.sendJoin();
        })
      })
    }

  }

})
