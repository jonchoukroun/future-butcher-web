import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import { later } from '@ember/runloop';

export default Component.extend({

  storeScreen:   null,

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

  storeInventory: computed('socket.stateData.station.store', function() {
    return get(this, 'socket.stateData.station.store');
  }),

  weaponsInventory: computed('storeInventory', function() {
    const inventory = get(this, 'storeInventory');
    let weapons = new Object();
    Object.keys(inventory).filter(i => inventory[i].weight).map(w => weapons[w] = inventory[w]);
    return weapons;
  }),

  packsInventory: computed('storeInventory', function() {
    const inventory = get(this, 'storeInventory');
    let packs = new Object();
    Object.keys(inventory).filter(i => inventory[i].pack_space).map(p => packs[p] = inventory[p]);
    return packs;
  }),

  weaponsInventoryCount: computed('weaponsInventory', function() {
    return Object.keys(get(this, 'weaponsInventory')).length;
  }),

  packsInventoryCount: computed('packsInventory', function() {
    return Object.keys(get(this, 'packsInventory')).length;
  }),

  actions: {

    showWeaponsStore() {
      set(this, 'storeScreen', 'weapons');
    },

    showPacksStore() {
      set(this, 'storeScreen', 'packs');
    },

    back() {
      set(this, 'storeScreen', null);
    }

  }

});
