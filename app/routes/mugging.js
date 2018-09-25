import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    let state = get(this, 'socket.gameStatus');

    if (state !== 'mugging' && state !== 'in_game') {
      this.replaceWith('home');
    }
  },

});
