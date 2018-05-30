import Controller    from '@ember/controller'
import { computed, get }  from '@ember/object'

export default Controller.extend({

  lastTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left') === 0;
  }),

  _endGame(payload) {
    get(this, 'socket').pushCallBack('end_game', payload);
    this.transitionToRoute('home');
  },

  actions: {

    quitGame() {
      let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };
      this._endGame(payload);
    },

    retirePlayer() {
      let score = get(this, 'stateData.player.debt') === 0 ?
        get(this, 'stateData.player.funds') : null;
      if (score === 0) { score = null; }

      let payload = {
        score: score,
        hash_id: localStorage.getItem('player_hash')
      };

      this._endGame(payload);
    },

    navigate(station) {
      get(this, 'socket').pushCallBack('change_station', { destination: station });
      this.transitionToRoute('game');
    }

  }
})
