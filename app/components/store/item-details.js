import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { later } from '@ember/runloop';
import { classNames } from '@ember-decorators/component';

import { storeItems } from 'future-butcher-web/fixtures/store-items';

@classNames('card', 'bg-black', 'mb-2', 'border-0')

export default class ItemDetailsComponent extends Component {

  item = this.item !== undefined ? this.item : null;
  details = this.details !== undefined ? this.details : null;

  inTransaction = false;

  @service('notification-service') notifications;

  @computed('item')
  get itemName() {
    return storeItems[this.get('item')].display;
  }

  @computed('details.price')
  get itemPrice() {
    return this.get('details.price');
  }

  @computed('details.cuts')
  get canHarvest() {
    let cuts = this.get('details.cuts');
    if (cuts.length > 0) {
      cuts = cuts.join(", ").split(" ");
      cuts.splice(cuts.length - 1, 0, "and");
      return cuts.join(" ");
    }
  }

  @computed('details.pack_space')
  get itemSpace() {
    return this.get('details.pack_space');
  }

  @computed('socket.stateData.player.funds')
  get playerFunds() {
    return this.get('socket.stateData.player.funds');
  }

  @computed('socket.stateData.player.weapon')
  get playerWeapon() {
    return this.get('socket.stateData.player.weapon');
  }

  @computed('socket.stateData.player.pack_space')
  get packSpace() {
    return this.get('socket.stateData.player.pack_space');
  }

  @computed('playerWeapon', 'packSpace', 'item', 'details')
  get alreadyOwned() {
    if (this.get('details.pack_space')) {
      return this.get('packSpace') === this.get('details.pack_space')
    } else {
      return this.get('playerWeapon') === this.get('item')
    }
  }

  @computed('alreadyOwned', 'playerFunds', 'playerWeapon', 'details.price')
  get canBuy() {
    if (this.get('alreadyOwned')) { return false; }

    let available_funds;
    const player_funds = this.get('playerFunds');
    const current_weapon = this.get('playerWeapon');

    let current_weapon_value = 0;
    if (current_weapon && this.get('socket.stateData.station.store')[current_weapon]) {
      current_weapon_value = this.get('socket.stateData.station.store')[current_weapon].price;
    }

    if (!this.get('itemSpace') && current_weapon_value) {
      available_funds = player_funds + current_weapon_value;
    } else {
      available_funds = player_funds;
    }

    return this.get('details.price') <= available_funds;
  }

  buyWeapon() {
    let action = "buy_weapon";
    if (this.get('playerWeapon')) {
      action = "replace_weapon";
    }
    this.get('socket').pushCallBack(action, {"weapon": this.get('item')}).then(() => {
      this.handleTransactionState("bought");
    })
  }

  buyPack() {
    this.get('socket').pushCallBack("buy_pack", {"pack": this.get('item')}).then(() => {
      this.handleTransactionState("bought");
    })
  }

  handleTransactionState(action) {
    later(() => {
      this.set('inTransaction', false);

      let payload = { action: action, item: this.get('itemName') }
      if (action !== "dropped") { payload.price = this.get('itemPrice'); }
      this.confirmTransaction(payload);
    }, 300);
  }

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

    this.get('notifications').renderNotification(message);
  }

  formatCurrency(value) {
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  }

  @action
  buyItem() {
    this.set('inTransaction', true);

    if (this.get('details.damage')) {
      this.buyWeapon();
    } else {
      this.buyPack();
    }
  }

  @action
  dropItem() {
    this.set('inTransaction', true);

    this.get('socket').pushCallBack("drop_weapon", {}).then(() => {
      this.handleTransactionState("dropped");
    })
  }

}
