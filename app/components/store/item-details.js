import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { storeItems, weaponStats } from 'future-butcher-web/fixtures/store-items';
import { later } from '@ember/runloop';

export default Component.extend({

  item:    null,
  details: null,

  inTransaction: false,

  classNames: ['card', 'bg-black', 'border-0'],

  notifications: service('notification-service'),

  isWeapon: computed('details', function() {
    return !!get(this, 'details.weight');
  }),

  itemName: computed('item', function() {
    return storeItems[get(this, 'item')].display;
  }),

  itemDescription: computed('item', function() {
    return storeItems[get(this, 'item')].description;
  }),

  itemPrice: computed('details.price', function() {
    return get(this, 'details.price');
  }),

  itemWeight: computed('details.weight', function() {
    return get(this, 'details.weight');
  }),

  itemSpace: computed('details.pack_space', function() {
    return get(this, 'details.pack_space');
  }),

  playerFunds: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  playerWeapon: computed('socket.stateData.player.weapon', function() {
    return get(this, 'socket.stateData.player.weapon');
  }),

  packSpace: computed('socket.stateData.player.pack_space', function() {
    return get(this, 'socket.stateData.player.pack_space');
  }),

  alreadyOwned: computed('playerWeapon', 'packSpace', 'item', 'details', function() {
    if (get(this, 'details.pack_space')) {
      return get(this, 'packSpace') === get(this, 'details.pack_space')
    } else {
      return get(this, 'playerWeapon') === get(this, 'item')
    }
  }),

  canAfford: computed('isWeapon', 'alreadyOwned', 'playerFunds', 'playerWeapon', 'details.price', function() {
    if (get(this, 'alreadyOwned')) { return; }

    let available_funds;
    const player_funds = get(this, 'playerFunds');
    const current_weapon = get(this, 'playerWeapon');

    let current_weapon_value = 0;
    if (current_weapon && get(this, 'socket.stateData.station.store')[current_weapon]) {
      current_weapon_value = get(this, 'socket.stateData.station.store')[current_weapon].price;
    }

    if (get(this, 'isWeapon') && current_weapon_value) {
      available_funds = player_funds + current_weapon_value;
    } else {
      available_funds = player_funds;
    }

    return get(this, 'details.price') <= available_funds;
  }),

  totalWeightCarried: computed('playerWeapon', 'socket.stateData.player.pack', function() {
    const pack = get(this, 'socket.stateData.player.pack');
    const current_weapon = weaponStats[get(this, 'playerWeapon')];

    let weapon_weight = 0;
    if (current_weapon) {
      weapon_weight = current_weapon.weight;
    }

    return Object.values(pack).reduce((cut, sum) => { return sum + cut; }) + weapon_weight;
  }),

  canCarry: computed('isWeapon', 'totalWeightCarried', 'packSpace', 'details.weight', function() {
    if (!get(this, 'isWeapon')) { return true; }

    return get(this, 'packSpace') >= get(this, 'details.weight') + get(this, 'totalWeightCarried');
  }),

  isDisabled: computed('isWeapon', 'canAfford', 'canCarry', 'alreadyOwned', function() {
    if (!get(this, 'isWeapon') && get(this, 'alreadyOwned')) {
      return true;
    }

    if ((!get(this, 'canAfford') || !get(this, 'canCarry')) && !get(this, 'alreadyOwned')) {
      return true;
    }

    return false;
  }),

  buyWeapon() {
    get(this, 'socket').pushCallBack("buy_weapon", {"weapon": get(this, 'item')}).then(() => {
      this.handleTransactionState("bought");
    })
  },

  buyPack() {
    get(this, 'socket').pushCallBack("buy_pack", {"pack": get(this, 'item')}).then(() => {
      this.handleTransactionState("bought");
    })
  },

  handleTransactionState(action) {
    later(() => {
      set(this, 'inTransaction', false);

      let payload = { action: action, item: get(this, 'itemName') }
      if (action !== "dropped") { payload.price = get(this, 'itemPrice'); }
      this.confirmTransaction(payload);
    }, 300);
  },

  confirmTransaction(payload) {
    let message;

    if (payload.price) {
      const price = this.formatCurrency(payload.price);

      if (payload.action === "replaced") {
        message = `Replaced your weapon with ${payload.item} for ${price}.`
      } else {
        message = `${payload.item} ${payload.action} for ${price}.`;
      }
    } else {
      message = `${payload.item} ${payload.action}.`;
    }

    get(this, 'notifications').renderNotification(message);
  },

  formatCurrency(value) {
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  },

  actions: {

    buyItem() {
      set(this, 'inTransaction', true);

      if (get(this, 'details.weight')) {
        this.buyWeapon();
      } else {
        this.buyPack();
      }
    },

    dropItem() {
      set(this, 'inTransaction', true);

      get(this, 'socket').pushCallBack("drop_weapon", {}).then(() => {
        this.handleTransactionState("dropped");
      })
    },

    replaceItem() {
      set(this, 'inTransaction', true);

      get(this, 'socket').pushCallBack("replace_weapon", {"weapon": get(this, 'item')}).then(() => {
        this.handleTransactionState("replaced");
      })
    }

  }

});
