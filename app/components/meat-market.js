import Component from '@ember/component'
import { computed, get, set } from '@ember/object'

export default Component.extend({

  elementId: 'meat-market',

  tagName: 'ul',

  classNames: ['list-group-flush', 'px-2'],

  showBuyForm:  false,
  showSellForm: false,
  buyingCut:    false,
  sellingCut:   false,

  marketCuts: computed('gameStatus', 'socket.stateData.station.market', function() {
    if (get(this, 'socket.gameStatus') !== 'in_game') { return; }

    return get(this, 'socket.stateData.station.market');
  }),

  actions: {

    sendRouteReload() {
      get(this, 'sendRouteReload')();
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
