import Service from '@ember/service';
import { set } from '@ember/object';
import { later } from '@ember/runloop';

export default Service.extend({

  confirmationMessage: null,
  errorMessage: null,
  pinnedMessage: null,

  renderNotification(message) {
    set(this, 'confirmationMessage', message);
    later(() => {
      set(this, 'confirmationMessage', null);
    }, 1300);
  },

  renderError(message) {
    set(this, 'errorMessage', message);
  },

  pinNotification(message) {
    set(this, 'pinnedMessage', message);
  },

  unpinNotification() {
    set(this, 'pinnedMessage', null);
  }

});
