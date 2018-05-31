import Component from '@ember/component'
import { computed, get } from '@ember/object'

export default Component.extend({

  tagName: 'li',

  classNames: ['list-group-item'],

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

  actions: {

    openBuyMenu() {
      get(this, 'sendOpenBuyMenu')(get(this, 'cut'));
    }

  }

})
