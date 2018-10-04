import Component from '@ember/component';
import { computed, get, observer, set } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { weaponStats } from 'future-butcher-web/fixtures/store-items';
import { inject as service } from '@ember/service';

export default Component.extend({

  classNames: ['d-flex', 'flex-column', 'align-items-center', 'justify-content-between'],

  cutName: null,

  invalidBuy: false,

  notifications: service('notification-service'),

  marketData: computed('socket.stateData.station.market', 'cutName', function() {
    let cutName = get(this, 'cutName');
    return get(this, 'socket.stateData.station.market')[cutName];
  }),

  cutPrice: computed('marketData', function() {
    return get(this, 'marketData.price');
  }),

  cutsAvailable: computed('marketData', function() {
    return get(this, 'marketData.quantity');
  }),

  playerFunds: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  packSpace: computed('socket.stateData.player.pack_space', function() {
    return get(this, 'socket.stateData.player.pack_space');
  }),

  totalWeightCarried: computed('socket.stateData.player.{pack,weapon}', function() {
    let weapon = get(this, 'socket.stateData.player.weapon');
    let weapon_weight = weapon ? weaponStats[weapon].weight : 0;

    return Object.values(get(this, 'socket.stateData.player.pack')).reduce((sum, cut) => {
      return sum + cut;
    }) + weapon_weight;
  }),

  maxAfford: computed('cutPrice', 'playerFunds', function() {
    return Math.floor(get(this, 'playerFunds') / get(this, 'cutPrice'));
  }),

  maxSpace: computed('packSpace', 'totalWeightCarried', 'cutsAvailable', function() {
    return Math.min(
      (get(this, 'packSpace') - get(this, 'totalWeightCarried')), get(this, 'cutsAvailable'));
  }),

  maxCanBuy: computed('maxAfford', 'maxSpace', function() {
    return Math.min(get(this, 'maxAfford'), get(this, 'maxSpace'));
  }),

  maxCanBuyPlaceholder: computed('maxCanBuy', function() {
    const max = get(this, 'maxCanBuy');
    const pluralizedPound = (max === 1 ? "lb" : "lbs");
    return htmlSafe(`You can buy ${max} ${pluralizedPound}`);
  }),

  maxCanBuyCost: computed('maxCanBuy', 'cutPrice', function() {
    return get(this, 'maxCanBuy') * get(this, 'cutPrice');
  }),

  validateEntry() {
    const buyAmount = get(this, 'buyAmount');

    let message;
    if (buyAmount > get(this, 'maxAfford')) {
      message = "You can't afford that many.";
    } else if (buyAmount > get(this, 'cutsAvailable')) {
      message = "Not that many cuts for sale.";
    } else if (buyAmount > get(this, 'maxSpace')) {
      message = "You don't have enough pack space."
    } else {
      message = null;
    }

    get(this, 'notifications').notifyError(message);
    set(this, 'invalidBuy', message);
  },

  buyCut() {
    let payload = {
      cut: get(this, 'cutName'),
      amount: get(this, 'buyAmount')
    };

    get(this, 'socket').pushCallBack("buy_cut", payload).then(() => {
      this.generateConfirmation(payload);
      get(this, 'sendBuyMenuClose')();
    });
  },

  generateConfirmation(payload) {
    const formatted_value = this.formatCurrency(get(this, 'estimatedCost'));
    const unit = (payload.amount === 1) ? "lb" : "lbs";
    const message = `Bought ${payload.amount} ${unit} of ${payload.cut} for ${formatted_value}!`

    get(this, 'notifications').notifyConfirmation(message);
  },

  formatCurrency(value) {
    if (this.isDestroyed || this.isDestroying) { return; }
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  },

  actions: {

    clickBack() {
      get(this, 'sendBuyMenuClose')();
    },

    calculateCost() {
      const cost = get(this, 'cutPrice') * get(this, 'buyAmount');
      set(this, 'estimatedCost', cost);

      this.validateEntry();
    },

    clickBuyMax() {
      set(this, 'buyAmount', get(this, 'maxCanBuy'));
      set(this, 'estimatedCost', get(this, 'maxCanBuyCost'));
      this.buyCut();
    },

    submitBuyCut() {
      this.buyCut();
    }
  }


})
