import Service from '@ember/service';
import { later } from '@ember/runloop';

export default class NotificationService extends Service {

  confirmationMessage;
  errorMessage;
  pinnedMessage;
  messageQueue = [];

  renderNotification(message) {
    this.set('confirmationMessage', message);
    later(() => {
      this.set('confirmationMessage', null);
    }, 1300);
  }

  renderError(message) {
    this.set('errorMessage', message);
  }

  pinNotification(message) {
    if (this.get('pinnedMessage')) {
      let messageQueue = this.get('messageQueue');
      messageQueue.push(message)
      this.set('messageQueue', messageQueue)
    } else {
      this.set('pinnedMessage', message);
    }
  }

  unpinNotification() {
    this.set('pinnedMessage', null);

    later(() => {
      if (this.get('messageQueue').length) {
        let messageQueue = this.get('messageQueue');
        const next_message = messageQueue.shift();

        this.pinNotification(next_message);
        this.set('messageQueue', messageQueue);
      }
    }, 400);

  }

}
