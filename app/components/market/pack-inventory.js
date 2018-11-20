import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { classNames } from '@ember-decorators/component';

@classNames('pack-inventory', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-between')

export default class PackInventoryComponent extends Component {

  @computed('socket.stateData.player.pack')
  get pack() {
    const pack = this.get('socket.stateData.player.pack')
    let inventory = new Object();
    Object.keys(pack).filter(cut => pack[cut] > 0).map(cut => {
      inventory[cut] = pack[cut];
    });
    return inventory;
  }

  @computed('pack')
  get hasInventory() {
    return Object.keys(this.get('pack')).length > 0;
  }

  @action
  clickBack() {
    this.get('sendInventoryClose')();
  }

}
