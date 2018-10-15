import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class MarketController extends Controller {

  @service('notification-service') notifications;

  constructor() {
    super(...arguments);

    this.handleQuantityNotification();
  }

  @computed('socket.stateData.player.debt')
  get isInDebt() {
    return this.get('socket.stateData.player.debt') > 0;
  }

  @computed('socket.stateData.station.station_name')
  get currentStation() {
    return this.get('socket.stateData.station.station_name');
  }

  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @computed('socket.stateData.station.market.flank.quantity')
  get flankQuantity() {

    console.log('flank', quantity);
    if (quantity === null) {
      this.handleQuantityNotification("flank");
    }
  }

  @computed('socket.stateData.station.market.heart.quantity')
  get heartQuantity() {

    console.log('heart', quantity);
    if (quantity === null) {
      this.handleQuantityNotification("heart");
    }
  }

  handleQuantityNotification() {
    const flank = this.get('socket.stateData.station.market.flank.quantity');
    const heart = this.get('socket.stateData.station.market.heart.quantity');
    console.log('flank', flank)
    console.log('heart', heart)

    if (!flank) {
      const message = `Demand for flank is surging. Prices are through the roof!`;
      this.get('notifications').pinNotification(message);
    }

    if (!heart) {
      const message = `Demand for heart is surging. Prices are through the roof!`;
      this.get('notifications').pinNotification(message);
    }
  }

  @action
  reloadRoute() {
    this.transitionToRoute('market');
  }

  @action
  sendToScores() {
    this.transitionToRoute('high-scores');
  }

}
