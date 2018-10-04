import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { loanOptions } from 'future-butcher-web/fixtures/loan-options';

export default Component.extend({

  debt:         null,
  rate:         null,
  selectedLoan: null,
  isFirstTurn:  null,
  playerFunds:  null,
  playerDebt:   null,

  notifications: service('notification-service'),

  init() {
    this._super(...arguments);

    set(this, 'loanOptions', loanOptions);
  },

  playerPack: computed('socket.stateData.player.pack', function() {
    return get(this, 'socket.stateData.player.pack');
  }),

  currentMarket: computed('socket.stateData.station.market', function() {
    return get(this, 'socket.stateData.station.market');
  }),

  estimatedCutsValue: computed('currentMarket', 'playerPack', function() {
    let sum = 0;
    const pack = get(this, 'playerPack');

    Object.keys(pack).map(cut => {
      const market_cut = get(this, 'currentMarket')[cut];
      if (market_cut) {
        sum += market_cut.price * pack[cut];
      }
    });
    return sum * 0.8;
  }),

  totalPlayerValue: computed('estimatedCutsValue', 'playerFunds', function() {
    const value = get(this, 'estimatedCutsValue') + get(this, 'playerFunds');
    if (value > 0) {
      return value;
    } else {
      return 5001;
    }
  }),

  confirmLoanBought(payload) {
    const debt = this.formatCurrency(payload.debt);
    const rate = Math.floor(payload.rate * 100);
    const message = `You bought a ${debt} loan with a ${rate}% interest rate.`;
    get(this, 'notifications').notifyConfirmation(message);
  },

  formatCurrency(value) {
    if (this.isDestroyed || this.isDestroying) { return; }
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  },

  actions: {

    selectLoan(debt, rate) {
      set(this, 'selectedLoan', debt);
      set(this, 'debt', debt);
      set(this, 'rate', rate);
    },

    buyLoan() {
      const payload = { debt: get(this, 'debt'), rate: get(this, 'rate') };
      get(this, 'socket').pushCallBack("buy_loan", payload).then(() => {
        this.confirmLoanBought(payload)
        get(this, 'sendToMarket')();
        set(this, 'debt', null);
        set(this, 'rate', null);
        set(this, 'selectedLoan', null);
      })
    }

  }

});
