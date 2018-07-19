import Component from '@ember/component'
import { computed, get }   from '@ember/object'

export default Component.extend({

  elementId: 'stats-bar',

  classNames: ['border-bottom', 'border-secondary'],

  stateData: computed('socket.stateData', function() {
    return get(this, 'socket.stateData');
  }),

  playerFunds: computed('stateData', function() {
    return get(this, 'stateData.player.funds');
  }),

  playerDebt: computed('stateData', function() {
    return get(this, 'stateData.player.principle');
  }),

  turnsLeft: computed('stateData.rules.turns_left', function() {
    return get(this, 'stateData.rules.turns_left');
  }),

  endGame(payload) {
    get(this, 'socket').pushCallBack('end_game', payload).then(() => {
      get(this, 'sendQuit')();
    });
  },

  actions: {

    payDebt() {
      let payload = { amount: get(this, 'playerDebt') };
      get(this, 'socket').pushCallBack("pay_debt", payload);
    },

    quitGame() {
      let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };
      this.endGame(payload);
    }

  }

})
