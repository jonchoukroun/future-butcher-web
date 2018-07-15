import Controller from '@ember/controller'
import { computed, get } from '@ember/object'
import ENV from '../config/environment'

export default Controller.extend({

  isDevelopmentENV: computed('ENV', function() {
    return ENV.environment === 'development' || ENV.environment === 'semilocal';
  }),

  lastTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left') === 0;
  }),

  endGame(payload) {
    get(this, 'socket').pushCallBack('end_game', payload).then(() => {
      this.transitionToRoute('high-scores');
    });
  },

  actions: {

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
        this.transitionToRoute('game');
      });
    }

  }
})
