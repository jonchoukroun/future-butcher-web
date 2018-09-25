import Component from '@ember/component';
import { computed, get } from '@ember/object';

export default Component.extend({

  playerStats: computed('socket.stateData.player', function() {
    return get(this, 'socket.stateData.player');
  }),

  playerFunds: computed('playerStats.funds', function() {
    return get(this, 'playerStatsfunds');
  }),

  playerDebt: computed('playerStats.debt', function() {
    return get(this, 'playerStats.debt');
  }),

  totalCutsOwned: computed('playerStats.pack', function() {
    return Object.values(get(this, 'playerStats.pack')).reduce((sum, cut) => {
      return sum += cut;
    });
  }),

  hasLooseEnds: computed('playerDebt', 'totalCutsOwned', function() {
    return get(this, 'playerDebt') || get(this, 'totalCutsOwned') > 0;
  }),

  actions: {

    retirePlayer() {
      let score = get(this, 'playerDebt') === 0 ?
        get(this, 'socket.stateData.player.funds') : null;
      if (score === 0) { score = null; }

      localStorage.setItem('player_score', score);

      let payload = {
        score: score,
        hash_id: localStorage.getItem('player_hash')
      };

      get(this, 'sendEndGame')(payload);
    }

  }

});
