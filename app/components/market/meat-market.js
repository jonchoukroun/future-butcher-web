import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

import { surgeMessages } from 'future-butcher-web/fixtures/surge-messages';

export default class MeatMarketComponent extends Component {

  showBuyForm  = false;
  showSellForm = false;
  buyingCut    = false;
  sellingCut   = false;
  isInDebt;

  @service('notification-service') notifications;

  didReceiveAttrs() {
    this._super(...arguments);

    this.handleQuantityNotification();
  }

  handleQuantityNotification() {
    const current_station = this.get('socket.stateData.station.station_name');
    const flank = this.get('socket.stateData.station.market.flank.quantity');
    const heart = this.get('socket.stateData.station.market.heart.quantity');
    const ribs  = this.get('socket.stateData.station.market.ribs.quantity');

    if (current_station !== "beverly_hills") { return; }

    if (!flank) {
      const flank_messages = surgeMessages.flankMessages;
      const message = flank_messages[Math.floor(Math.random() * Math.floor(flank_messages.length))];
      this.get('notifications').pinNotification(message);
    }

    if (!heart) {
      const heart_messages = surgeMessages.heartMessages;
      const message = heart_messages[Math.floor(Math.random() * Math.floor(heart_messages.length))];
      this.get('notifications').pinNotification(message);
    }

    if (!ribs) {
      const ribs_messages = surgeMessages.ribsMessages;
      const message = ribs_messages[Math.floor(Math.random() * Math.floor(ribs_messages.length))];
      this.get('notifications').pinNotification(message);
    }
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
