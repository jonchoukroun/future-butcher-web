import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class FundsDetailsComponent extends Component {

  isFirstTurn;
  playerFunds;

  @action
  closeFundsTutorial() {
    this.get('sendCloseFundsTutorial')();
  }

  @action
  toggleStatsBar() {
    this.get('sendToggleStatsBar')("#fundsDetails");
  }

}
