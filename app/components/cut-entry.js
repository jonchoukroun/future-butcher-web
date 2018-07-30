import Component from '@ember/component'
import { computed, get } from '@ember/object'
import { cutStats } from '../fixtures/cut-stats'

export default Component.extend({

  classNames: ['cut-entry'],

  cut:      null,
  price:    null,
  quantity: null,

  canAffordCut: computed('price', 'socket.stateData.player.funds', function() {
    let price = get(this, 'price');
    let funds = get(this, 'socket.stateData.player.funds');
    return funds >= price;
  }),

  totalCutsOwned: computed('socket.stateData.player.pack', function() {
    let pack = get(this, 'socket.stateData.player.pack');
    return Object.values(pack).reduce((sum, cut) => { return sum + cut; });
  }),

  hasPackSpace: computed('totalCutsOwned', function() {
    return 20 > get(this, 'totalCutsOwned');
  }),

  cutsOwned: computed('socket.stateData.player.pack', 'cut', function() {
    return get(this, 'socket.stateData.player.pack')[get(this, 'cut')];
  }),

  medianPrice: computed('cut', function() {
    return cutStats[get(this, 'cut')];
  }),

  actions: {

    openBuyMenu() {
      get(this, 'sendOpenBuyMenu')(get(this, 'cut'));
    },

    openSellMenu() {
      get(this, 'sendOpenSellMenu')(get(this, 'cut'));
    }

  }

})
