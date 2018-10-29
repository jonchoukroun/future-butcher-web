import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { later } from '@ember/runloop';

export default class MeatMarketComponent extends Component {

  showBuyForm  = false;
  showSellForm = false;
  buyingCut    = false;
  sellingCut   = false;
  isInDebt;

  @service('notification-service') notifications;

  didReceiveAttrs() {
    this._super(...arguments);
  }

  @computed('gameStatus', 'socket.stateData.station.market')
  get marketCuts() {
    if (this.get('socket.gameStatus') !== 'in_game') { return; }
    return this.get('socket.stateData.station.market');
  }

  @computed('socket.stateData.player.pack_space')
  get packSpace() {
    return this.get('socket.stateData.player.pack_space');
  }

  @computed('socket.stateData.player.pack')
  get totalWeightCarried() {
    return Object.values(this.get('socket.stateData.player.pack')).reduce((sum, cut) => {
      return sum += cut;
    });
  }

  @computed('socket.stateData.player.{funds,debt}')
  get canVisitBank() {
    const funds = this.get('socket.stateData.player.funds');
    const debt = this.get('socket.stateData.player.debt');

    if (debt && debt > 0) {
      return funds > debt;
    }

    return funds > 0;
  }

  @action
  openBuyMenu(cut) {
    this.set('showInventory', false);
    this.set('showSellForm', false);
    this.set('showBuyForm', true);
    this.set('buyingCut', cut);
  }

  @action
  closeBuyMenu() {
    this.$('.buy-menu').addClass('terminal-close');
    later(() => {
      this.set('showBuyForm', false);
      this.set('buyingCut', null);
      this.$('.buy-menu').removeClass('terminal-close');
    }, 300);
  }

  @action
  openSellMenu(cut) {
    this.set('showInventory', false);
    this.set('showBuyForm', false);
    this.set('showSellForm', true);
    this.set('sellingCut', cut);
  }

  @action
  closeSellMenu() {
    this.$('.sell-menu').addClass('terminal-close');
    later(() => {
      this.set('showSellForm', false);
      this.set('sellingCut', null);
      this.$('.sell-menu').removeClass('terminal-close');
    }, 300);
  }

  @action
  openInventory() {
    this.set('showBuyForm', false);
    this.set('showSellForm', false);
    this.set('showInventory', true);
  }

  @action
  closeInventory() {
    this.$('.pack-inventory').addClass('terminal-close');
    later(() => {
      this.set('showInventory', false);
      this.$('.pack-inventory').removeClass('terminal-close');
    }, 300);
  }

}
