import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class ApplicationController extends Controller {

  confirmationMessage = null;
  errorMessage        = null;
  pinnedMessage       = null;

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

  @computed('notifications.stackPosition')
  get stackPosition() {
    return this.get('notifications.stackPosition');
  }

  @action
  unpinNotification() {
    this.get('notifications').unpinNotification();
  }

}
