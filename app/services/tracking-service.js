import Service from '@ember/service';
import { service } from '@ember-decorators/service';
import ENV from '../config/environment';

export default class TrackingService extends Service {

  @service logger;

  trackUser(user_id, player_name) {
    if (ENV.environment !== 'production') { return; }

    this.get('logger').info('user', 'Joined game', { player_name: player_name });
  }

  trackEvent(event_name, payload = {}) {
      if (ENV.environment !== 'production') { return; }

    this.get('logger').info('gameplay', event_name, payload);
  }

}
