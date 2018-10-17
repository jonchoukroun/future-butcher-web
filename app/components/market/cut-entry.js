import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { cutStats } from 'future-butcher-web/fixtures/cut-stats';
import { classNames } from '@ember-decorators/component';

@classNames('cut-entry')
export default class CutEntryComponent extends Component {

  cut;
  price;
  quantity;

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
    return cutStats[this.get('cut')];
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
