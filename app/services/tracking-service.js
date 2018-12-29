import Service from '@ember/service';
import ENV from '../config/environment';

export default class TrackingService extends Service {

  trackEvent(event_name, payload = null) {
    if (ENV.environment !== 'production') { return; }

    analytics.track(event_name, payload);
  }

}
