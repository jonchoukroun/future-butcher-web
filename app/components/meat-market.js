import Component from '@ember/component'
import { computed, get, set } from '@ember/object'

export default Component.extend({

  elementId: 'meat-market',

  showBuyForm:      false,
  showSellForm:     false,
  buyingCut:        false,
  sellingCut:       false,
  transactionAlert: null,

  marketCuts: computed('gameStatus', 'socket.stateData.station.market', function() {
    if (get(this, 'socket.gameStatus') !== 'in_game') { return; }

    return get(this, 'socket.stateData.station.market');
  }),

  totalCutsOwned: computed('socket.stateData.player.pack', function() {
    return Object.values(get(this, 'socket.stateData.player.pack')).reduce((sum, cut) => {
      return sum += cut;
    });
  }),

  formatCurrency(value) {
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  },

  actions: {

    sendTransactionConfirmed(action, payload, value) {
      let formatted_value =  this.formatCurrency(value);
      if (action === "buy") {
        let message = `${payload.amount} lbs of ${payload.cut} bought for ${formatted_value}!`
        get(this, 'sendTransactionAlert')(message);
      } else {
        let message = `${payload.amount} lbs of ${payload.cut} sold for ${formatted_value}!`
        get(this, 'sendTransactionAlert')(message);
      }
    },

    openBuyMenu(cut) {
      set(this, 'showBuyForm', true);
      set(this, 'buyingCut', cut);
    },

    closeBuyMenu() {
      set(this, 'showBuyForm', false);
      set(this, 'buyingCut', null);
    },

    openSellMenu(cut) {
      set(this, 'showSellForm', true);
      set(this, 'sellingCut', cut);
    },

    closeSellMenu() {
      set(this, 'showSellForm', false);
      set(this, 'sellingCut', null);
    }
  }

})
