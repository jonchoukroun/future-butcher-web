import Component from '@ember/component'
import { computed, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/string'

export default Component.extend({

  classNames: ['d-flex', 'flex-column', 'align-items-center', 'justify-content-between'],

  cutName: null,

  invalidSell: null,

  notifications: service('notification-service'),

  cutPrice: computed('socket.stateData.station.market', 'cutName', function() {
    return get(this, 'socket.stateData.station.market')[get(this, 'cutName')].price;
  }),

  cutsOwned: computed('socket.stateData.player.pack', 'cutName', function() {
    return get(this, 'socket.stateData.player.pack')[get(this, 'cutName')];
  }),

  cutsOwnedProfit: computed('cutsOwned', 'cutPrice', function() {
    return get(this, 'cutPrice') * get(this, 'cutsOwned');
  }),

  cutsOwnedPlaceholder: computed('cutsOwned', function() {
    const owned = get(this, 'cutsOwned');
    const pluralizedPound = (owned === 1 ? "lb" : "lbs");
    return htmlSafe(`You can sell ${owned} ${pluralizedPound}`);
  }),

  validateEntry() {
    let message;
    if (get(this, 'sellAmount') > get(this, 'cutsOwned')) {
      message = "You don't own that many.";
    } else {
      message = null;
    }

    get(this, 'notifications').renderError(message);
    set(this, 'invalidSell', message);
  },

  sellCut() {
    let payload = {
      cut: get(this, 'cutName'),
      amount: get(this, 'sellAmount')
    };

    get(this, 'socket').pushCallBack("sell_cut", payload).then(() => {
      this.generateConfirmation(payload);
      get(this, 'sendSellMenuClose')();
    });
  },

  generateConfirmation(payload) {
    const formatted_value = this.formatCurrency(get(this, 'estimatedProfit'));
    const unit = (payload.amount === 1) ? "lb" : "lbs";
    const message = `Sold ${payload.amount} ${unit} of ${payload.cut} for ${formatted_value}!`

    get(this, 'notifications').renderNotification(message);
  },

  formatCurrency(value) {
    if (this.isDestroyed || this.isDestroying) { return; }
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  },

  actions: {

    clickBack() {
      get(this, 'sendSellMenuClose')();
    },

    calculateProfit() {
      let profit = get(this, 'cutPrice') * get(this, 'sellAmount');
      set(this, 'estimatedProfit', profit);

      this.validateEntry();
    },

    clickSellMax() {
      set(this, 'sellAmount', get(this, 'cutsOwned'));
      set(this, 'estimatedProfit', get(this, 'cutsOwnedProfit'));
      this.sellCut();
    },

    submitSellCut() {
      this.sellCut();
    }
  }


})
