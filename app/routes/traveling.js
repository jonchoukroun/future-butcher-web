import Route from '@ember/routing/route';
import { service } from '@ember-decorators/service';
import { later } from '@ember/runloop';

import { cutStats } from 'future-butcher-web/fixtures/cut-stats';
import { surgeMessages } from 'future-butcher-web/fixtures/surge-messages';

export default class TravelingRoute extends Route {

  @service('notification-service') notifications;

  beforeModel() {
    this._super(...arguments);

    this.handleAnimation();
    this.handleTimingNotifications();
    this.handleSurgeNotifications();
  }

  handleTimingNotifications() {
    const current_station = this.get('socket.stateData.station.station_name');
    const turns_left = this.get('socket.stateData.rules.turns_left');

    let message;
    if (current_station !== "bell_gardens" && turns_left === 20) {
      message = "Gus's Army Surplus Store is now open in Bell Gardens.";
    }

    if (turns_left === 5) {
      message = "Only 5 hours left!";
    }

    this.get('notifications').pinNotification(message)
  }

  handleSurgeNotifications() {
    const current_station = this.get('socket.stateData.station.station_name');
    const flank = this.get('socket.stateData.station.market.flank.price');
    const heart = this.get('socket.stateData.station.market.heart.price');
    const ribs  = this.get('socket.stateData.station.market.ribs.price');

    if (current_station !== "beverly_hills") { return; }

    if (flank >= cutStats.flank.surgeMinimum) {
      const flank_messages = surgeMessages.flankMessages;
      const message = flank_messages[Math.floor(Math.random() * Math.floor(flank_messages.length))];
      this.get('notifications').pinNotification(message);
    }

    if (heart >= cutStats.heart.surgeMinimum) {
      const heart_messages = surgeMessages.heartMessages;
      const message = heart_messages[Math.floor(Math.random() * Math.floor(heart_messages.length))];
      this.get('notifications').pinNotification(message);
    }

    if (ribs >= cutStats.ribs.surgeMinimum) {
      const ribs_messages = surgeMessages.ribsMessages;
      const message = ribs_messages[Math.floor(Math.random() * Math.floor(ribs_messages.length))];
      this.get('notifications').pinNotification(message);
    }
  }

  handleAnimation() {
    later(() => {
      this.handleRouteRedirect(0);
    }, 600);
  }

  handleRouteRedirect(counter) {
    counter   = counter || 0;
    let state = this.get('socket.gameStatus');

    if (!state) {
      this.handleRouteRedirect(counter + 1)
    } else if (state === 'mugging') {
      this.replaceWith('mugging');
    } else if (state === 'in_game') {
      this.replaceWith('market')
    } else {
      this.replaceWith('home');
    }
  }

}
