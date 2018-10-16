import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';

export default class DebtDetailsComponent extends Component {

  isSecondTurn;
  playerDebt;
  playerFunds;

  @computed('isSecondTurn', 'socket.stateData.rules.turns_left')
  get secondTurnHours() {
    if (!this.get('isSecondTurn')) { return; }

    return 24 - this.get('socket.stateData.rules.turns_left');
  }

  @action
  closeDebtTutorial() {
    this.get('sendCloseDebtTutorial')();
  }

  @action
  toggleStatsBar() {
    this.get('sendToggleStatsBar')("#debtDetails");
  }

  @action
  payDebt() {
    this.get('socket').pushCallBack("pay_debt");
  }

}
