import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { attribute, classNames } from '@ember-decorators/component';
import { service } from '@ember-decorators/service';
import $ from 'jquery';

@classNames('fixed-top', 'full-width-bar', 'row', 'justify-content-center', 'm-0', 'p-0', 'bg-black')
export default class StatsBarComponent extends Component {

  @service router;

  didInsertElement() {
    this._super(...arguments);

    const first_turn = this.get('isFirstTurn');
    const funds      = this.get('playerFunds');
    const debt       = this.get('playerDebt');
    const route      = this.get('router.currentRouteName');

    if (first_turn && !localStorage.getItem('closed-turns-tutorial') && route === "subway") {
      console.log('should see turnsHelp')
      $('#turnsHelp').slideToggle();
    }

    if (first_turn && !localStorage.getItem('closed-funds-tutorial') && funds > 0) {
      console.log('should see funds help')
      $('#fundsHelp').slideToggle();
    }

    if (this.get('isSecondTurn') && !localStorage.getItem('closed-debt-tutorial') && debt > 0) {
      console.log('should see debt help');
      $('#debtHelp').slideToggle();
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
  get isFirstTurn() {
    return this.get('turnsLeft') === 24;
  }

  @computed('turnsLeft')
  get isSecondTurn() {
    return this.get('turnsLeft') === 23;
  }

  endGame(payload) {
    this.get('socket').pushCallBack('end_game', payload).then(() => {
      this.get('sendQuit')();
    });
  }

  @action
  closeTurnsTutorial() {
    localStorage.setItem('closed-turns-tutorial', true);
    $('#turnsHelp').slideToggle();
  }

  @action
  closeFundsTutorial() {
    localStorage.setItem('closed-funds-tutorial', true);
    $('#fundsHelp').slideToggle();
  }

  @action
  closeDebtTutorial() {
    localStorage.setItem('closed-debt-tutorial', true);
    $('#debtHelp').slideToggle();
  }

  @action
  toggleStatsBar(selector) {
    $(selector).slideToggle();
  }

  @action
  quitGame() {
    let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };
    this.endGame(payload);
  }

}
