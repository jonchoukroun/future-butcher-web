import Service from '@ember/service';
import { service } from '@ember-decorators/service';

export default class TrackingService extends Service {

  @service logger;

  trackUser(user_id, player_name) {
    this.get('logger').info('user', 'Joined game', { player_name: player_name });
  }

  trackEvent(event_name, payload = {}) {
    this.get('logger').info('gameplay', event_name, payload);
  }

}
