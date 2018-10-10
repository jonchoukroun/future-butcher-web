import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { action } from '@ember-decorators/component';

import { loanOptions } from 'future-butcher-web/fixtures/loan-options';

export default class DebtPurchaseComponent extends Component {

  debt         = null;
  rate         = null;
  selectedLoan = null;
  isFirstTurn  = null;
  playerFunds  = null;
  playerDebt   = null;

  @service('notification-service') notifications;

  constructor() {
    this._super(...arguments);

    this.set('loanOptions', loanOptions);
  }

  @computed('socket.stateData.player.pack')
  get playerPack() {
    return this.get('socket.stateData.player.pack');
  }

  @computed('socket.stateData.station.market')
  get currentMarket() {
    return this.get('socket.stateData.station.market');
  }

  @computed('currentMarket', 'playerPack')
  get estimatedCutsValue() {
    let sum = 0;
    const pack = this.get('playerPack');

    Object.keys(pack).map(cut => {
      const market_cut = this.get('currentMarket')[cut];
      if (market_cut) {
        sum += market_cut.price * pack[cut];
      }
    });
    return sum * 0.8;
  }

  @computed('estimatedCutsValue', 'playerFunds')
  get totalPlayerValue() {
    const value = this.get('estimatedCutsValue') + this.get('playerFunds');
    if (value > 0) {
      return value;
    } else {
      return 5001;
    }
  }

  confirmLoanBought(payload) {
    const debt = this.formatCurrency(payload.debt);
    const rate = Math.floor(payload.rate * 100);
    const message = `You bought a ${debt} loan with a ${rate}% interest rate.`;
    this.get('notifications').renderNotification(message);
  }

  formatCurrency(value) {
    if (this.isDestroyed || this.isDestroying) { return; }
    return (value).toLocaleString("en-us",
      { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
  }

  @action
  selectLoan(debt, rate) {
    this.set('selectedLoan', debt);
    this.set('debt', debt);
    this.set('rate', rate);
  }

  @action
  buyLoan() {
    const payload = { debt: this.get('debt'), rate: this.get('rate') };
    this.get('socket').pushCallBack("buy_loan", payload).then(() => {
      this.confirmLoanBought(payload)
      this.get('sendToMarket')();
      this.set('debt', null);
      this.set('rate', null);
      this.set('selectedLoan', null);
    })
  }

}
