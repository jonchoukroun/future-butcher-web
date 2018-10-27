import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { classNames } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import $ from 'jquery';

@classNames('full-width-bar', 'row', 'justify-content-center')
export default class StatsBarComponent extends Component {

  @service router;

  didInsertElement() {
    this._super(...arguments);

    const first_turn = this.get('isFirstTurn');
    const funds      = this.get('playerFunds');
    const debt       = this.get('playerDebt');
    const route      = this.get('router.currentRouteName');

    if (first_turn && !localStorage.getItem('closed-navigation-tutorial') && route === "subway") {
      $('#navigationDetails').slideToggle();
    }

    if (first_turn && !localStorage.getItem('closed-funds-tutorial') && funds > 0) {
      $('#fundsDetails').slideToggle();
    }

    if (this.get('isSecondTurn') && !localStorage.getItem('closed-debt-tutorial') && debt > 0) {
      $('#debtDetails').slideToggle();
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
    $('#navigationDetails').slideToggle();
  }

  @action
  closeFundsTutorial() {
    localStorage.setItem('closed-funds-tutorial', true);
    $('#fundsDetails').slideToggle();
  }

  @action
  closeDebtTutorial() {
    localStorage.setItem('closed-debt-tutorial', true);
    $('#debtDetails').slideToggle();
  }

  @action
  toggleStatsBar(selector) {
    $(selector).slideToggle();
  }

  @action
  quitGame() {
    this.get('sendQuit')();
  }

}
