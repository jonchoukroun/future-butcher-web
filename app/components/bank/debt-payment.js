import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({

  isFirstTurn: null,
  playerFunds: null,

  notifications: service('notification-service'),

  currentDebtRate: computed('socket.stateData.player.rate', function() {
    return get(this, 'socket.stateData.player.rate') * 100;
  }),

  nextTurnDebt: computed('socket.stateData.player.{debt,rate}', function() {
    let debt = get(this, 'socket.stateData.player.debt');
    let rate = get(this, 'socket.stateData.player.rate');

    return Math.round(debt * (1 + rate));
  }),

  confirmDebtPaid(debt) {
    const formatted_debt = this.formatCurrency(debt);
    const message = `You paid your ${formatted_debt} debt to the Shavings & Bone Bank.`;
    get(this, 'notifications').notifyConfirmation(message);
  },

  formatCurrency(value) {
    if (this.isDestroyed || this.isDestroying) { return; }
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  },

  actions: {

    payDebt() {
      let payload = { amount: get(this, 'playerDebt') };
      get(this, 'socket').pushCallBack("pay_debt", payload).then(() => {
        this.confirmDebtPaid(payload.amount);
      })
    }

  }

});
