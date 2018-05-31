import Component from '@ember/component'
import { computed, get, set } from '@ember/object'

export default Component.extend({

  classNames: ['d-flex', 'flex-column', 'align-items-center', 'justify-content-between', 'p-3'],

  cutName:      null,

  cutPrice: computed('socket.stateData.station.market', 'cutName', function() {
    return get(this, 'socket.stateData.station.market')[get(this, 'cutName')].price;
  }),

  playerFunds: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  cutsOwned: computed('socket.stateData.player.pack', 'cutName', function() {
    return get(this, 'socket.stateData.player.pack')[get(this, 'cutName')];
  }),

  errorMessage: computed('sellAmount', 'cutsOwned', function() {
    let message;

    if (get(this, 'sellAmount') > get(this, 'cutsOwned')) {
      message = "You don't own that many.";
    } else {
      null;
    }

    return message;
  }),

  actions: {

    clickBack() {
      get(this, 'sendSellMenuClose')();
    },

    calculateProfit() {
      let profit = get(this, 'cutPrice') * get(this, 'sellAmount');
      set(this, 'estimatedProfit', profit);
    },

    submitSellCut() {
      let payload = {
        cut: get(this, 'cutName'),
        amount: get(this, 'sellAmount')
      };

      get(this, 'socket').pushCallBack("sell_cut", payload);
      set(this, 'transactionConfirmed', true);
    }
  }


})
