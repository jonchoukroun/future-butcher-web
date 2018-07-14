import Controller from '@ember/controller'
import { computed, get, observer, set } from '@ember/object'

export default Controller.extend({

  screen: 'welcome',

  gameStarted: observer('socket.gameStatus', function() {
    if (get(this, 'socket.gameStatus')) {
      this.transitionToRoute('game');
    }
  }),

  actions: {

    startGame() {
      get(this, 'socket').pushCallBack("start_game", {});
    }

  }
})
