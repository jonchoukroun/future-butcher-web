import Service from '@ember/service';
import { service } from '@ember-decorators/service';

export default class TrackingService extends Service {

  @service() logger;

  trackUserEvent(event_name, player_name) {
    amplitude.getInstance().logEvent(event_name, { player_name: player_name });
  }
}
