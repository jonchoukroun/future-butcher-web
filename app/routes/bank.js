import Route from '@ember/routing/route'
import { get, observer } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    if (get(this, 'socket.gameStatus') !== 'in_game') {
      this.replaceWith('home');
    }
  },

})
