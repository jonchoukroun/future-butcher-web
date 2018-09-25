import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({

  isFirstTurn: null,
  playerFunds: null,

  currentDebtRate: computed('socket.stateData.player.rate', function() {
    return get(this, 'socket.stateData.player.rate') * 100;
  }),

  nextTurnDebt: computed('socket.stateData.player.{debt,rate}', function() {
    let debt = get(this, 'socket.stateData.player.debt');
    let rate = get(this, 'socket.stateData.player.rate');

    return Math.floor(debt * (1 + rate));
  }),

  actions: {

    payDebt() {
      let payload = { amount: get(this, 'playerDebt') };
      get(this, 'socket').pushCallBack("pay_debt", payload).then(() => {
        get(this, 'sendDebtPaidConfirm')()
      })
    }

  }

});
