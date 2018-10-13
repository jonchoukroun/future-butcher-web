import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class MeatMarketComponent extends Component {

  showBuyForm  = false;
  showSellForm = false;
  buyingCut    = false;
  sellingCut   = false;
  isInDebt;

  @service('notification-service') notifications;

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
    this.set('showBuyForm', true);
    this.set('buyingCut', cut);
  }

  @action
  closeBuyMenu() {
    this.set('showBuyForm', false);
    this.set('buyingCut', null);
  }

  @action
  openSellMenu(cut) {
    this.set('showSellForm', true);
    this.set('sellingCut', cut);
  }

  @action
  closeSellMenu() {
    this.set('showSellForm', false);
    this.set('sellingCut', null);
  }

}
