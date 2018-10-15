import Route from '@ember/routing/route';
import { service } from '@ember-decorators/service';
import { later } from '@ember/runloop';

export default class TravelingRoute extends Route {

  @service('notification-service') notifications;

  beforeModel() {
    this._super(...arguments);

    this.handleAnimation();
    this.handleNotifications();
  }

  handleNotifications() {
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
