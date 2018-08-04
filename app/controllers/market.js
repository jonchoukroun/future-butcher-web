import Controller from '@ember/controller'
import { computed, get, set } from '@ember/object'
import { debounce } from '@ember/runloop'
import $ from 'jquery'

export default Controller.extend({

  isInDebt: computed('socket.stateData.player.debt', function() {
    return get(this, 'socket.stateData.player.debt') > 0;
  }),

  isDowntown: computed('socket.stateData.station.station_name', function() {
    return get(this, 'socket.stateData.station.station_name') === "downtown";
  }),

  handleTransactionAlert(message) {
    const el = $('.transaction-alert');

    set(this, 'transactionAlert', null);

    set(this, 'transactionAlert', message);
    el.fadeIn();

    debounce(() => {
      el.fadeOut();
    }, 1300);
  },

  actions: {

    reloadRoute() {
      this.transitionToRoute('market');
    },

    sendToScores() {
      this.transitionToRoute('high-scores');
    },

    confirmTransaction(transactionAlert) {
      this.handleTransactionAlert(transactionAlert);
    }

  }

})
