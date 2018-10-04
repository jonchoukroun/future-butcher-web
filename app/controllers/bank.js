import Controller from '@ember/controller';
import { computed, get, set } from '@ember/object';
import { later } from '@ember/runloop';

export default Controller.extend({

  isFirstTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left') === 24;
  }),

  playerFunds: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  playerDebt: computed('socket.stateData.player.debt', function() {
    return get(this, 'socket.stateData.player.debt');
  }),

  actions: {

    sendToScores() {
      this.transitionToRoute('high-scores');
    },

    redirectToMarket() {
      this.transitionToRoute('market');
    }

  }

})
