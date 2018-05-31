import Component from '@ember/component'
import { computed, get, set } from '@ember/object'

export default Component.extend({

  classNames: ['d-flex', 'flex-column', 'align-items-center', 'justify-content-between', 'p-3'],

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

  actions: {

    clickBack() {
      get(this, 'sendBuyMenuClose')();
    },

    calculateCost() {
      let cost = get(this, 'cutPrice') * get(this, 'buyAmount');
      set(this, 'estimatedCost', cost);
    },

    submitBuyCut() {
      let payload = {
        cut: get(this, 'cutName'),
        amount: get(this, 'buyAmount')
      };

      get(this, 'socket').pushCallBack("buy_cut", payload);
      set(this, 'transactionConfirmed', true);
    }
  }


})
