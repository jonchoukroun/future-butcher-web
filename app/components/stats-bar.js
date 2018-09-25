import Component from '@ember/component'
import { computed, get }   from '@ember/object'
import $ from 'jquery'

export default Component.extend({

  elementId: 'stats-bar',

  classNames: ['row', 'justify-content-center', 'm-0', 'p-0', 'bg-black'],

  didInsertElement() {
    this._super(...arguments);

    if (get(this, 'isFirstTurn') && !localStorage.getItem('closed-turns-tutorial')) {
      $('#turnsHelp').slideToggle();
    }

    if (get(this, 'isFirstTurn') && !localStorage.getItem('closed-funds-tutorial') &&
      get(this, 'playerFunds') > 0) {
      $('#fundsHelp').slideToggle();
    }

    if (get(this, 'isSecondTurn') && !localStorage.getItem('closed-debt-tutorial') &&
      get(this, 'playerDebt') > 0) {
      $('#debtHelp').slideToggle();
    }
  },

  currentStation: computed('socket.stateData.station.station_name', function() {
    return get(this, 'socket.stateData.station.station_name');
  }),

  playerFunds: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  playerDebt: computed('socket.stateData.player.debt', function() {
    return get(this, 'socket.stateData.player.debt');
  }),

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

  isFirstTurn: computed('turnsLeft', function() {
    return get(this, 'turnsLeft') === 24;
  }),

  isSecondTurn: computed('turnsLeft', function() {
    return get(this, 'turnsLeft') === 23;
  }),

  endGame(payload) {
    get(this, 'socket').pushCallBack('end_game', payload).then(() => {
      get(this, 'sendQuit')();
    });
  },

  actions: {

    closeTurnsTutorial() {
      localStorage.setItem('closed-turns-tutorial', true);
      $('#turnsHelp').slideToggle();
    },

    closeFundsTutorial() {
      localStorage.setItem('closed-funds-tutorial', true);
      $('#fundsHelp').slideToggle();
    },

    closeDebtTutorial() {
      localStorage.setItem('closed-debt-tutorial', true);
      $('#debtHelp').slideToggle();
    },

    toggleStatsBar(selector) {
      $(selector).slideToggle();
    },

    quitGame() {
      let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };
      this.endGame(payload);
    }

  }

})
