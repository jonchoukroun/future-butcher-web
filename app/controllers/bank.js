import Controller from '@ember/controller'
import { computed, get, set } from '@ember/object'

export default Controller.extend({

  debt: null,
  rate:  null,

  isFirstTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
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
      })
    }
  }

})
