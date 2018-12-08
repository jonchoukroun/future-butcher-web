import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { classNames } from '@ember-decorators/component';

import { cutStats } from 'future-butcher-web/fixtures/cut-stats';

@classNames('cut-entry')

export default class CutEntryComponent extends Component {

  cut = this.cut !== undefined ? this.cut : null;
  price = this.price !== undefined ? this.price : null;
  quantity = this.quantity !== undefined ? this.quantity : null;

  @computed('cut', 'price')
  get isSurgePrice() {
    let cut = ["heart", "flank", "ribs", "liver", "brains"].filter(cut =>
      cut === this.get('cut'))[0];

    if (cut) {
      return this.get('price') >= cutStats[this.get('cut')].surgeMinimum;
    }

    return false;
  }

  @computed('price', 'socket.stateData.player.funds')
  get canAffordCut() {
    const price = this.get('price');
    const funds = this.get('socket.stateData.player.funds');
    return funds >= price;
  }

  @computed('socket.stateData.player.pack')
  get totalWeightCarried() {
    return Object.values(this.get('socket.stateData.player.pack')).reduce((sum, cut) => {
      return sum + cut;
    });
  }

  @computed('socket.stateData.player.pack_space', 'totalWeightCarried')
  get hasPackSpace() {
    return this.get('socket.stateData.player.pack_space') > this.get('totalWeightCarried');
  }

  @computed('socket.stateData.player.pack', 'cut')
  get cutsOwned() {
    return this.get('socket.stateData.player.pack')[this.get('cut')];
  }

  @computed('cut')
  get medianPrice() {
    return cutStats[this.get('cut')].median;
  }

  @action
  openBuyMenu() {
    this.get('sendOpenBuyMenu')(this.get('cut'));
  }

  @action
  openSellMenu() {
    this.get('sendOpenSellMenu')(this.get('cut'));
  }

}
