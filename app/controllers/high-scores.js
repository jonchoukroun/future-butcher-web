import Controller from '@ember/controller'
import { get, observer  } from '@ember/object'

export default Controller.extend({

  gameStarted: observer('socket.gameStatus', function() {
    if (get(this, 'socket.gameStatus')) {
      this.transitionToRoute('game');
    }
  }),

  actions: {

    startNewGame() {
      localStorage.removeItem('player_score');
      this.transitionToRoute('home');
    }
  }

});
