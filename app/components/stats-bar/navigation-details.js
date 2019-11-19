import Component from '@ember/component';
import { action, computed } from '@ember/object';

export default class NavigationDetailsComponent extends Component {

  isFirstTurn = this.isFirstTurn !== undefined ? this.isFirstTurn : false;

  @computed('socket.stateData.player.pack')
  get ownedCut() {
    const pack = this.get('socket.stateData.player.pack');
    return Object.keys(pack).filter(cut => pack[cut] && pack[cut] > 0)[0];
  }

  @action
  closeNavigationTutorial() {
    this.get('sendCloseNavigationTutorial')();
  }

  @action
  closeNavigationDetails() {
    this.get('sendToggleStatsBar')("#navigationDetails");
  }
}
