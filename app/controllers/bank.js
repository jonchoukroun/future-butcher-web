import Controller from '@ember/controller'
import { computed, get, set } from '@ember/object'
import { loanOptions } from '../fixtures/loan-options'

export default Controller.extend({

  debt: null,
  rate: null,

  init() {
    this._super(...arguments);
    set(this, 'loanOptions', loanOptions);
  },

  isFirstTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left') === 24;
  }),

  playerStats: computed('socket.stateData.player', function() {
    return get(this, 'socket.stateData.player');
  }),

  playerFunds: computed('playerStats.funds', function() {
    return get(this, 'playerStats.funds');
  }),

  playerPack: computed('playerStats.pack', function() {
    return get(this, 'playerStats.pack');
  }),

  currentMarket: computed('socket.stateData.station.market', function() {
    return get(this, 'socket.stateData.station.market');
  }),

  estimatedCutsValue: computed('currentMarket', 'playerPack', function() {
    let sum = 0;
    const pack = get(this, 'playerPack');

    Object.keys(pack).map(cut => { sum += get(this, 'currentMarket')[cut].price * pack[cut]; });
    return sum * 0.8;
  }),

  totalPlayerValue: computed('estimatedCutsValue', 'playerFunds', function() {
    const value = get(this, 'estimatedCutsValue') + get(this, 'playerFunds');
    console.log('value', value);
    if (value > 0) {
      return value;
    } else {
      return 5001;
    }
  }),

  actions: {

    sendToScores() {
      this.transitionToRoute('high-scores');
    },

    selectLoan(debt, rate) {
      set(this, 'debt', debt);
      set(this, 'rate', rate);
    },

    buyLoan() {
      const payload = { debt: get(this, 'debt'), rate: get(this, 'rate') };
      get(this, 'socket').pushCallBack("buy_loan", payload).then(() => {
        this.transitionToRoute('market');
        set(this, 'debt', null);
        set(this, 'rate', null);
      })
    }
  }

})
