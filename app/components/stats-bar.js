import Component from '@ember/component'
import { computed, get }   from '@ember/object'
import $ from 'jquery'

export default Component.extend({

  elementId: 'stats-bar',

  classNames: ['border-bottom', 'border-secondary', 'bg-black'],

  didInsertElement() {
    this._super(...arguments);

    if (get(this, 'isFirstTurn') && get(this, 'playerDebt') === 0) {
      $('#turnsHelp').slideToggle();
    }

    if (get(this, 'isFirstTurn') && get(this, 'playerFunds') > 0) {
      $('#fundsHelp').slideToggle();
    }

    if (get(this, 'isSecondTurn') && get(this, 'playerDebt') > 0) {
      $('#debtHelp').slideToggle();
    }
  },


  stateData: computed('socket.stateData', function() {
    return get(this, 'socket.stateData');
  }),

  playerFunds: computed('stateData', function() {
    return get(this, 'stateData.player.funds');
  }),

  playerDebt: computed('stateData', function() {
    return get(this, 'stateData.player.debt');
  }),

  turnsLeft: computed('stateData.rules.turns_left', function() {
    return get(this, 'stateData.rules.turns_left');
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

    toggleStatsBar(selector) {
      $(selector).slideToggle();
    },

    payDebt() {
      let payload = { amount: get(this, 'playerDebt') };
      get(this, 'socket').pushCallBack("pay_debt", payload);
    },

    quitGame() {
      let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };
      this.endGame(payload);
    }

  }

})
