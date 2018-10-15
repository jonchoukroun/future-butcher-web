import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class ApplicationController extends Controller {

  confirmationMessage;
  errorMessage;
  pinnedMessage;

  @service('notification-service') notifications;

  @computed('notifications.confirmationMessage')
  get confirmationNotification() {
    return this.get('notifications.confirmationMessage');
  }

  @computed('notifications.errorMessage')
  get errorNotification() {
    return this.get('notifications.errorMessage');
  }

  @computed('notifications.pinnedMessage')
  get pinnedNotification() {
    return this.get('notifications.pinnedMessage');
  }

  @action
  unpinNotification() {
    this.get('notifications').unpinNotification();
  }

}
