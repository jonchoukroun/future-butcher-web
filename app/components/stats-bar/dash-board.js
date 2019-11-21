import Component from '@ember/component';
import jQuery from 'jquery';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { classNames } from '@ember-decorators/component';

@classNames('stats-bar', 'row', 'justify-content-center')
export default class StatsBarComponent extends Component {

  @service router;

  didInsertElement() {
    super.didInsertElement(...arguments);

    const first_turn = this.get('isFirstTurn');
    const funds      = this.get('playerFunds');
    const debt       = this.get('playerDebt');
    const route      = this.get('router.currentRouteName');

    if (first_turn && !localStorage.getItem('closed-navigation-tutorial') && route === "subway") {
      jQuery('#navigationDetails').slideToggle();
    }

    if (first_turn && !localStorage.getItem('closed-funds-tutorial') && funds > 0) {
      jQuery('#fundsDetails').slideToggle();
    }

    if (this.get('isSecondTurn') && !localStorage.getItem('closed-debt-tutorial') && debt > 0) {
      jQuery('#debtDetails').slideToggle();
    }
  }

  @computed('socket.stateData.station.station_name')
  get currentStation() {
    return this.get('socket.stateData.station.station_name');
  }

  @computed('socket.stateData.player.funds')
  get playerFunds() {
    return this.get('socket.stateData.player.funds');
  }

  @computed('socket.stateData.player.debt')
  get playerDebt() {
    return this.get('socket.stateData.player.debt');
  }


  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @computed('turnsLeft')
  get timeLeft() {
    const current_turn = 24 - this.get('turnsLeft');

    let time = (5 + current_turn) % 12;
    if (time === 0) {
      time = 12;
    }

    let unit = "am";
    if (current_turn >= 7 && current_turn <= 18) {
      unit = "pm";
    }

    return `${time}:00 ${unit}`;
  }

  @computed('turnsLeft')
  get isFirstTurn() {
    return this.get('turnsLeft') === 24;
  }

  @computed('turnsLeft')
  get isSecondTurn() {
    const turns_left = this.get('turnsLeft');
    return turns_left < 24 && turns_left >= 19;
  }

  @action
  closeNavigationTutorial() {
    localStorage.setItem('closed-navigation-tutorial', true);
    jQuery('#navigationDetails').slideToggle();
  }

  @action
  closeFundsTutorial() {
    localStorage.setItem('closed-funds-tutorial', true);
    jQuery('#fundsDetails').slideToggle();
  }

  @action
  closeDebtTutorial() {
    localStorage.setItem('closed-debt-tutorial', true);
    jQuery('#debtDetails').slideToggle();
  }

  @action
  toggleStatsBar(selector) {
    jQuery(selector).slideToggle();
  }

  @action
  quitGame() {
    this.get('sendQuit')();
  }

}
