import Component from '@ember/component'
import { computed, get, set } from '@ember/object'
import { htmlSafe } from '@ember/string'

export default Component.extend({

  classNames: ['d-flex', 'flex-column', 'align-items-center', 'justify-content-between'],

  cutName:      null,

  marketData: computed('socket.stateData.station.market', 'cutName', function() {
    let cutName = get(this, 'cutName');
    return get(this, 'socket.stateData.station.market')[cutName];
  }),

  cutPrice: computed('marketData', function() {
    return get(this, 'marketData.price');
  }),

  cutsAvailable: computed('marketData', function() {
    return get(this, 'marketData.quantity');
  }),

  playerFunds: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  totalCutsOwned: computed('socket.stateData.player.pack', function() {
    let pack = get(this, 'socket.stateData.player.pack');
    return Object.values(pack).reduce((sum, cut) => { return sum + cut; });
  }),

  maxAfford: computed('cutPrice', 'playerFunds', function() {
    return Math.floor(get(this, 'playerFunds') / get(this, 'cutPrice'));
  }),

  maxSpace: computed('totalCutsOwned', 'cutsAvailable', function() {
    return Math.min((20 - get(this, 'totalCutsOwned')), get(this, 'cutsAvailable'));
  }),

  maxCanBuy: computed('maxAfford', 'maxSpace', function() {
    return Math.min(get(this, 'maxAfford'), get(this, 'maxSpace'));
  }),

  maxCanBuyPlaceholder: computed('maxCanBuy', function() {
    const max = get(this, 'maxCanBuy');
    const pluralizedPound = (max === 1 ? "lb" : "lbs");
    return htmlSafe(`You can buy ${max} ${pluralizedPound}`);
  }),

  maxCanBuyCost: computed('maxCanBuy', 'cutPrice', function() {
    return get(this, 'maxCanBuy') * get(this, 'cutPrice');
  }),

  errorMessage: computed('buyAmount', 'maxAfford', 'maxSpace', 'cutsAvailable', function() {
    let buyAmount = get(this, 'buyAmount');
    let message;

    if (buyAmount > get(this, 'maxAfford')) {
      message = "You can't afford that many.";
    } else if (buyAmount > get(this, 'cutsAvailable')) {
      message = "Not that many cuts for sale.";
    } else if (buyAmount > get(this, 'maxSpace')) {
      message = "You don't have enough pack space."
    } else {
      null;
    }

    return message;
  }),

  buyCut() {
    let payload = {
      cut: get(this, 'cutName'),
      amount: get(this, 'buyAmount')
    };

    get(this, 'socket').pushCallBack("buy_cut", payload).then(() => {
      get(this, 'sendBuyMenuClose')();
      get(this, 'sendTransactionConfirmed')("buy", payload, get(this, 'estimatedCost'))
    });
  },

  actions: {

    clickBack() {
      get(this, 'sendBuyMenuClose')();
    },

    calculateCost() {
      let cost = get(this, 'cutPrice') * get(this, 'buyAmount');
      set(this, 'estimatedCost', cost);
    },

    clickBuyMax() {
      set(this, 'buyAmount', get(this, 'maxCanBuy'));
      set(this, 'estimatedCost', get(this, 'maxCanBuyCost'));
      this.buyCut();
    },

    submitBuyCut() {
      this.buyCut();
    }
  }


})
