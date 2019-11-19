import Component from '@ember/component';
import { action } from '@ember/object';

export default class FundsDetailsComponent extends Component {

  isFirstTurn = this.isFirstTurn !== undefined ? this.isFirstTurn : false;
  playerFunds = this.playerFunds !== undefined ? this.playerFunds : null;

  @action
  closeFundsTutorial() {
    this.get('sendCloseFundsTutorial')();
  }

  @action
  toggleStatsBar() {
    this.get('sendToggleStatsBar')("#fundsDetails");
  }

}
