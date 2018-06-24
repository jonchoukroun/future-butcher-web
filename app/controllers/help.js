import Controller from '@ember/controller'
import { get } from '@ember/object'

export default Controller.extend({

  incrementGamesCount() {
    let count = localStorage.getItem('games_played');
    if (count) {
      localStorage.setItem('games_played', ++count);
    } else {
      localStorage.setItem('games_played', 1);
    }
  },

  actions: {

    quitGame() {
      let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };

      get(this, 'socket').pushCallBack('end_game', payload).then(() => {
        this.transitionToRoute('high-scores');
        this.incrementGamesCount();
      });
    }

  }
})
