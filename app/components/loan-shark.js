import Component from '@ember/component'
import { computed, get } from '@ember/object'

export default Component.extend({

  classNames: ['d-flex', 'flex-column', 'align-items-center', 'justify-content-between', 'p-3'],

  playerFunds: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  playerDebt: computed('socket.stateData.player.debt', function() {
    return get(this, 'socket.stateData.player.debt');
  }),

  fundsRemaining: computed('playerFunds', 'playerDebt', function() {
    return (get(this, 'playerFunds') - get(this, 'playerDebt'));
  }),

  actions: {

    payDebt() {
      let payload = { amount: get(this, 'playerDebt') };
      
      get(this, 'socket').pushCallBack("pay_debt", payload).then(() => {
        get(this, 'sendToGameRoute')();
      });
    },

    clickBack() {
      get(this, 'sendToGameRoute')();
    }
  }
})
