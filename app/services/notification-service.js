import Service from '@ember/service';
import { set } from '@ember/object';
import { later } from '@ember/runloop';

export default Service.extend({

  confirmationMessage: null,
  errorMessage: null,

  notifyConfirmation(message) {
    set(this, 'confirmationMessage', message);
    later(() => {
      set(this, 'confirmationMessage', null);
    }, 1300);
  },

  notifyError(message) {
    set(this, 'errorMessage', message);
  }

});
