import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { cutStats } from 'future-butcher-web/fixtures/cut-stats';
import { weaponStats } from 'future-butcher-web/fixtures/store-items';

export default Component.extend({

  classNames: ['cut-entry', 'mb-1'],

  cut:      null,
  price:    null,
  quantity: null,

  canAffordCut: computed('price', 'socket.stateData.player.funds', function() {
    let price = get(this, 'price');
    let funds = get(this, 'socket.stateData.player.funds');
    return funds >= price;
  }),

  totalWeightCarried: computed('socket.stateData.player.{pack,weapon}', function() {
    let weapon = get(this, 'socket.stateData.player.weapon');
    let weapon_weight = weapon ? weaponStats[weapon].weight : 0;

    return Object.values(get(this, 'socket.stateData.player.pack')).reduce((sum, cut) => {
      return sum + cut;
    }) + weapon_weight;
  }),

  hasPackSpace: computed('socket.stateData.player.pack_space', 'totalWeightCarried', function() {
    return get(this, 'socket.stateData.player.pack_space') > get(this, 'totalWeightCarried');
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
