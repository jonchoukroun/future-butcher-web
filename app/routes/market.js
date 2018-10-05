import Route from '@ember/routing/route'
import { computed, get } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    this.handleRouteRedirect();

    if (get(this, 'isFirstTurn') && get(this, 'hasNoDebt')) {
      this.replaceWith('bank');
    }
  },

  handleRouteRedirect() {
    let state = get(this, 'socket.gameStatus');

    if (state === 'mugging') {
      this.replaceWith('mugging');
    } else if (state !== 'in_game') {
      this.replaceWith('home');
    } else {
      return;
    }
  },

  isFirstTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left') === 24;
  }),

  hasNoDebt: computed('socket.stateData.player.debt', function() {
    return !get(this, 'socket.stateData.player.debt') > 0
  })

})
