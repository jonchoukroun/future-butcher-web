import Controller from '@ember/controller'
import { computed, get, set } from '@ember/object'

export default Controller.extend({

  principle: null,
  interest:  null,

  isFirstTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

  actions: {

    sendToScores() {
      this.transitionToRoute('high-scores');
    },

    selectLoan(principle, interest) {
      set(this, 'principle', principle);
      set(this, 'interest', interest);
    },

    buyLoan() {
      const payload = { principle: get(this, 'principle'), interest: get(this, 'interest') };
      get(this, 'socket').pushCallBack("buy_loan", payload).then(() => {
        this.transitionToRoute('market');
      })
    }
  }

})
