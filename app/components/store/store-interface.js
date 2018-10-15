import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';

export default class StoreInterfaceComponent extends Component {

  storeScreen;

  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @computed('socket.stateData.station.store')
  get storeInventory() {
    return this.get('socket.stateData.station.store');
  }

  @computed('storeInventory')
  get weaponsInventory() {
    const inventory = this.get('storeInventory');
    let weapons = new Object();
    Object.keys(inventory).filter(i => inventory[i].damage).map(w => weapons[w] = inventory[w]);
    return weapons;
  }

  @computed('storeInventory')
  get packsInventory() {
    const inventory = this.get('storeInventory');
    let packs = new Object();
    Object.keys(inventory).filter(i => inventory[i].pack_space).map(p => packs[p] = inventory[p]);
    return packs;
  }

  @action
  showWeaponsStore() {
    this.set('storeScreen', 'weapons');
  }

  @action
  showPacksStore() {
    this.set('storeScreen', 'packs');
  }

  @action
  back() {
    this.set('storeScreen', null);
  }

}
