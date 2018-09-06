import Route from '@ember/routing/route'
import { computed, get } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    if (get(this, 'socket.gameStatus') !== 'in_game') {
      this.replaceWith('home');
    }

    if (get(this, 'isFirstTurn') && get(this, 'hasNoFunds')) {
      this.replaceWith('bank');
    }
  },

  isFirstTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left') === 24;
  }),

  hasNoFunds: computed('socket.stateData.player.funds', function() {
    return !get(this, 'socket.stateData.player.funds') > 0
  })

})
