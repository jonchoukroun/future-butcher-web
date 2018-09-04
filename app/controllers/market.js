import Controller from '@ember/controller'
import { computed, get, set } from '@ember/object'
import { later } from '@ember/runloop'

export default Controller.extend({

  isInDebt: computed('socket.stateData.player.debt', function() {
    return get(this, 'socket.stateData.player.debt') > 0;
  }),

  isDowntown: computed('socket.stateData.station.station_name', function() {
    return get(this, 'socket.stateData.station.station_name') === "downtown";
  }),

  actions: {

    reloadRoute() {
      this.transitionToRoute('market');
    },

    sendToScores() {
      this.transitionToRoute('high-scores');
    },

    confirmTransaction(message) {
      set(this, 'transactionAlert', message);
      later(() => {
        set(this, 'transactionAlert', null);
      }, 1200);
    }

  }

})
