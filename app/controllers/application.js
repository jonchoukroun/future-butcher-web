import Controller from '@ember/controller';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({

  confirmationMessage: null,
  errorMessage:        null,

  notifications: service('notification-service'),

  confirmationNotification: computed('notifications.confirmationMessage', function() {
    return get(this, 'notifications.confirmationMessage');
  }),

  errorNotification: computed('notifications.errorMessage', function() {
    return get(this, 'notifications.errorMessage');
  })

});
