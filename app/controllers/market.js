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

    if (el.is(':visible')) {
      el.fadeOut(200);
      set(this, 'transactionAlert', null);
    }

    set(this, 'transactionAlert', message);
    el.fadeIn(300);

    debounce(() => {
      el.slideUp();
    }, 2000);
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
