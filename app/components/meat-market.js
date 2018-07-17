import Component from '@ember/component'
import { computed, get, set } from '@ember/object'
import { later } from '@ember/runloop'

export default Component.extend({

  elementId: 'meat-market',

  tagName: 'ul',

  classNames: ['list-group-flush', 'px-2'],

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

  actions: {

    sendTransactionConfirmed(action, payload, value) {
      if (action === "buy") {
        let message = `${payload.amount} lbs of ${payload.cut} bought for $${value}!`
        set(this, 'transactionAlert', message);
      } else {
        let message = `${payload.amount} lbs of ${payload.cut} bought for $${value}!`
        set(this, 'transactionAlert', message);
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
