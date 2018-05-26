import Component    from '@ember/component'
import { get, set } from '@ember/object'

export default Component.extend({

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
      get(this, 'socket').connect({ name: get(this, 'playerName') });
      get(this, 'sendJoin')();
    }

  }

})
