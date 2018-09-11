import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

  storeInventory: computed('socket.stateData.station.store', function() {
    return get(this, 'socket.stateData.station.store');
  }),

  weaponsAvailable: computed('storeInventory', function() {
    const inventory = get(this, 'storeInventory');
    let weapons = new Map();
    Object.keys(inventory).filter(i => inventory[i].weight).map(w =>
      weapons.set(w, inventory[w]));
    return weapons;
  }),

  packsAvailable: computed('storeInventory', function() {
    const inventory = get(this, 'storeInventory');
    let packs = new Map();
    Object.keys(inventory).filter(i => inventory[i].pack_space).map(p =>
      packs.set(p, inventory[p]));
    return packs;
  })

});
