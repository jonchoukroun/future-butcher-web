import Component from '@ember/component'
import { htmlSafe } from '@ember/string'
import { computed, get, set } from '@ember/object'

export default Component.extend({

  classNames: ['d-flex', 'flex-column', 'align-items-center', 'justify-content-between', 'p-3'],

  cutName:      null,

  cutPrice: computed('socket.stateData.station.market', 'cutName', function() {
    return get(this, 'socket.stateData.station.market')[get(this, 'cutName')].price;
  }),

  cutsOwned: computed('socket.stateData.player.pack', 'cutName', function() {
    return get(this, 'socket.stateData.player.pack')[get(this, 'cutName')];
  }),

  cutsOwnedProfit: computed('cutsOwned', 'cutPrice', function() {
    return get(this, 'cutPrice') * get(this, 'cutsOwned');
  }),

  cutsOwnedPlaceholder: computed('cutsOwned', function() {
    return htmlSafe(`You own ${get(this, 'cutsOwned')} lbs.`);
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

  sellCut() {
    let payload = {
      cut: get(this, 'cutName'),
      amount: get(this, 'sellAmount')
    };

    get(this, 'socket').pushCallBack("sell_cut", payload).then(() => {
      set(this, 'transactionConfirmed', true);
    });
  },

  actions: {

    clickBack() {
      get(this, 'sendSellMenuClose')();
    },

    calculateProfit() {
      let profit = get(this, 'cutPrice') * get(this, 'sellAmount');
      set(this, 'estimatedProfit', profit);
    },

    clickSellMax() {
      set(this, 'sellAmount', get(this, 'cutsOwned'));
      set(this, 'estimatedProfit', get(this, 'cutsOwnedProfit'));
      this.sellCut();
    },

    submitSellCut() {
      this.sellCut();
    }
  }


})
