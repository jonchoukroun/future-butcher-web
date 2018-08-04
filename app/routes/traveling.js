import Route from '@ember/routing/route'
import { get } from '@ember/object'
import { later } from '@ember/runloop'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    if (get(this, 'socket.gameStatus') !== 'in_game') {
      this.replaceWith('home');
    }

    this.handleAnimation();
  },

  handleAnimation() {
    later(() => {
      this.replaceWith('market');
    }, 700);
  }

})
