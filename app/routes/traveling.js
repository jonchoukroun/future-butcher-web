import Route from '@ember/routing/route'
import { get } from '@ember/object'
import { later } from '@ember/runloop'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    this.handleAnimation();
  },

  handleAnimation() {
    later(() => {
      this.handleRouteRedirect(0);
    }, 700);
  },

  handleRouteRedirect(counter) {
    counter   = counter || 0;
    let state = get(this, 'socket.gameStatus');

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

})
