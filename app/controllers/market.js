import Controller from '@ember/controller'
import { set } from '@ember/object'
import { debounce } from '@ember/runloop'
import $ from 'jquery'

export default Controller.extend({

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
