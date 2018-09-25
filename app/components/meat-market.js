import Component from '@ember/component'
import { computed, get, set } from '@ember/object'
import { weaponStats } from 'future-butcher-web/fixtures/store-items';

export default Component.extend({

  elementId: 'meat-market',

  showBuyForm:      false,
  showSellForm:     false,
  buyingCut:        false,
  sellingCut:       false,
  transactionAlert: null,
  isInDebt:         null,

  marketCuts: computed('gameStatus', 'socket.stateData.station.market', function() {
    if (get(this, 'socket.gameStatus') !== 'in_game') { return; }

    return get(this, 'socket.stateData.station.market');
  }),

  packSpace: computed('socket.stateData.player.pack_space', function() {
    return get(this, 'socket.stateData.player.pack_space');
  }),

  totalWeightCarried: computed('socket.stateData.player.{pack,weapon}', function() {
    let weapon = get(this, 'socket.stateData.player.weapon');
    let weapon_weight = weapon ? weaponStats[weapon].weight : 0;

    return Object.values(get(this, 'socket.stateData.player.pack')).reduce((sum, cut) => {
      return sum += cut;
    }) + weapon_weight;
  }),

  canVisitBank: computed('socket.stateData.player.{funds,debt}', function() {
    let funds = get(this, 'socket.stateData.player.funds');
    let debt = get(this, 'socket.stateData.player.debt');

    if (debt && debt > 0) {
      return funds > debt;
    }

    return funds > 0;
  }),

  formatCurrency(value) {
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  },

  actions: {

    sendTransactionConfirmed(action, payload, value) {
      let formatted_value = this.formatCurrency(value);
      let unit = (payload.amount === 1) ? "lb" : "lbs";
      if (action === "buy") {
        let message = `Bought ${payload.amount} ${unit} of ${payload.cut} for ${formatted_value}!`
        get(this, 'sendTransactionAlert')(message);
      } else {
        let message = `Sold ${payload.amount} ${unit} of ${payload.cut} for ${formatted_value}!`
        get(this, 'sendTransactionAlert')(message);
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
