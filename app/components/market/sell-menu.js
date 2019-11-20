import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { classNames } from '@ember-decorators/component';
import { htmlSafe } from '@ember/string';

@classNames('sell-menu', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-between')

export default class SellMenuComponent extends Component {

  cutName = this.cutName !== undefined ? this.cutName : null;

  @service('notification-service') notifications;

  @computed('socket.stateData.station.market', 'cutName')
  get cutPrice() {
    return this.get('socket.stateData.station.market')[this.get('cutName')].price;
  }

  @computed('socket.stateData.player.pack', 'cutName')
  get cutsOwned() {
    return this.get('socket.stateData.player.pack')[this.get('cutName')];
  }

  @computed('cutsOwned', 'cutPrice')
  get cutsOwnedProfit() {
    return this.get('cutPrice') * this.get('cutsOwned');
  }

  @computed('cutsOwned')
  get cutsOwnedPlaceholder() {
    const owned = this.get('cutsOwned');
    const pluralizedPound = (owned === 1 ? "lb" : "lbs");
    return htmlSafe(`You can sell ${owned} ${pluralizedPound}`);
  }

  validateEntry() {
    let message;
    if (this.get('sellAmount') > this.get('cutsOwned')) {
      message = "You don't own that many.";
    } else {
      message = null;
    }

    this.get('notifications').renderError(message);
    this.set('invalidSell', message);
  }

  sellCut() {
    const payload = {
      cut: this.get('cutName'),
      amount: this.get('sellAmount')
    };

    this.get('socket').pushCallBack("sell_cut", payload).then(() => {
      this.generateConfirmation(payload);
      this.set('sellAmount', null);
      this.get('sendSellMenuClose')();
    });
  }

  generateConfirmation(payload) {
    const formatted_value = this.formatCurrency(this.get('estimatedProfit'));
    const unit = (payload.amount === 1) ? "lb" : "lbs";
    const message = `Sold ${payload.amount} ${unit} of ${payload.cut} for ${formatted_value}!`;

    this.get('notifications').renderNotification(message);
  }

  formatCurrency(value) {
    if (this.isDestroyed || this.isDestroying) { return; }
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  }

  @action
  clickBack() {
    this.set('sellAmount', null);
    this.get('notifications').renderError(null);
    this.get('sendSellMenuClose')();
  }

  @action
  calculateProfit() {
    const profit = this.get('cutPrice') * this.get('sellAmount');
    this.set('estimatedProfit', profit);

    this.validateEntry();
  }

  @action
  clickSellMax() {
    this.set('sellAmount', this.get('cutsOwned'));
    this.set('estimatedProfit', this.get('cutsOwnedProfit'));
    this.sellCut();
  }

  @action
  submitSellCut() {
    this.sellCut();
  }
}
