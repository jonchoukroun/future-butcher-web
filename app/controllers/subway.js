import Controller from '@ember/controller'
import { computed, get } from '@ember/object'

export default Controller.extend({

  lastTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left') === 0;
  }),

  playerStats: computed('socket.stateData.player', function() {
    return get(this, 'socket.stateData.player');
  }),

  playerDebt: computed('playerStats.debt', function() {
    return get(this, 'playerStats.debt');
  }),

  hasPayableDebt: computed('playerStats.funds', 'playerDebt', function() {
    const debt = get(this, 'playerDebt');

    return debt > 0 && get(this, 'playerStats.funds') > debt;
  }),

  totalCutsOwned: computed('playerStats.pack', function() {
    return Object.values(get(this, 'playerStats.pack')).reduce((sum, cut) => {
      return sum += cut;
    });
  }),

  hasLooseEnds: computed('hasPayableDebt', 'totalCutsOwned', function() {
    return get(this, 'hasPayableDebt') || get(this, 'totalCutsOwned') > 0;
  }),

  endGame(payload) {
    get(this, 'socket').pushCallBack('end_game', payload).then(() => {
      this.transitionToRoute('high-scores');
    });
  },

  actions: {

    sendToScores() {
      this.transitionToRoute('high-scores');
    },

    payDebt() {
      get(this, 'socket').pushCallBack("pay_debt", { amount: get(this, 'playerDebt') });
    },

    quitGame() {
      let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };
      this.endGame(payload);
    },

    retirePlayer() {
      let score = get(this, 'socket.stateData.player.debt') === 0 ?
        get(this, 'socket.stateData.player.funds') : null;
      if (score === 0) { score = null; }

      localStorage.setItem('player_score', score);

      let payload = {
        score: score,
        hash_id: localStorage.getItem('player_hash')
      };

      this.endGame(payload);
    },

    navigate(station) {
      let payload = { destination: station };
      get(this, 'socket').pushCallBack('change_station', payload).then(() => {
        this.transitionToRoute('market');
      });
    }

  }
})
