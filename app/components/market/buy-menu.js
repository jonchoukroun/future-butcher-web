import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { classNames } from '@ember-decorators/component';
import { htmlSafe } from '@ember/string';

@classNames('buy-menu', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-between')

export default class BuyMenu extends Component {

  cutName = this.cutName !== undefined ? this.cutName : null;

  @service('notification-service') notifications;

  @computed('socket.stateData.station.market', 'cutName')
  get marketData() {
    const cutName = this.get('cutName');
    return this.get('socket.stateData.station.market')[cutName];
  }

  @computed('marketData')
  get cutPrice() {
    return this.get('marketData.price');
  }

  @computed('marketData')
  get cutsAvailable() {
    return this.get('marketData.quantity');
  }

  @computed('socket.stateData.player.funds')
  get playerFunds() {
    return this.get('socket.stateData.player.funds');
  }

  @computed('socket.stateData.player.pack_space')
  get packSpace() {
    return this.get('socket.stateData.player.pack_space');
  }

  @computed('socket.stateData.player.{pack,weapon}')
  get totalWeightCarried() {
    return Object.values(this.get('socket.stateData.player.pack')).reduce((sum, cut) => {
      return sum + cut;
    });
  }

  @computed('cutPrice', 'playerFunds')
  get maxAfford() {
    return Math.floor(this.get('playerFunds') / this.get('cutPrice'));
  }

  @computed('packSpace', 'totalWeightCarried', 'cutsAvailable')
  get maxSpace() {
    return Math.min(
      (this.get('packSpace') - this.get('totalWeightCarried')), this.get('cutsAvailable'));
  }

  @computed('maxAfford', 'maxSpace')
  get maxCanBuy() {
    return Math.min(this.get('maxAfford'), this.get('maxSpace'));
  }

  @computed('maxCanBuy')
  get maxCanBuyPlaceholder() {
    const max = this.get('maxCanBuy');
    const pluralizedPound = (max === 1 ? "lb" : "lbs");
    return htmlSafe(`You can buy ${max} ${pluralizedPound}`);
  }

  @computed('maxCanBuy', 'cutPrice')
  get maxCanBuyCost() {
    return this.get('maxCanBuy') * this.get('cutPrice');
  }

  validateEntry() {
    const buyAmount = this.get('buyAmount');

    let message;
    if (buyAmount > this.get('maxAfford')) {
      message = "You can't afford that many.";
    } else if (buyAmount > this.get('cutsAvailable')) {
      message = "Not that many cuts for sale.";
    } else if (buyAmount > this.get('maxSpace')) {
      message = "You don't have enough pack space."
    } else {
      message = null;
    }

    this.get('notifications').renderError(message);
    this.set('invalidBuy', message);
  }

  buyCut() {
    const payload = {
      cut: this.get('cutName'),
      amount: this.get('buyAmount')
    };

    this.get('socket').pushCallBack("buy_cut", payload).then(() => {
      this.generateConfirmation(payload);
      this.set('buyAmount', null);
      this.get('sendBuyMenuClose')();
    });
  }

  generateConfirmation(payload) {
    const formatted_value = this.formatCurrency(this.get('estimatedCost'));
    const unit = (payload.amount === 1) ? "lb" : "lbs";
    const message = `Bought ${payload.amount} ${unit} of ${payload.cut} for ${formatted_value}!`

    this.get('notifications').renderNotification(message);
  }

  formatCurrency(value) {
    if (this.isDestroyed || this.isDestroying) { return; }
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  }

  @action
  clickBack() {
    this.set('buyAmount', null);
    this.get('notifications').renderError(null);
    this.get('sendBuyMenuClose')();
  }

  @action
  calculateCost() {
    const cost = this.get('cutPrice') * this.get('buyAmount');
    this.set('estimatedCost', cost);

    this.validateEntry();
  }

  @action
  clickBuyMax() {
    this.set('buyAmount', this.get('maxCanBuy'));
    this.set('estimatedCost', this.get('maxCanBuyCost'));
    this.buyCut();
  }

  @action
  submitBuyCut() {
    this.buyCut();
  }

  didInsertElement() {
    super.didInsertElement();
    this.$('#buy-input').focus();
  }

}
