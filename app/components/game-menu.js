import Component from '@ember/component'
import { get, observer } from '@ember/object'

export default Component.extend({

  gameStarted: observer('socket.gameStatus', function() {
    if (get(this, 'socket.gameStatus')) {
      get(this, 'sendGameStarted')();
    }
  }),

  actions: {

    startGame() {
      get(this, 'socket').pushCallBack("new_game", {});
      get(this, 'socket').pushCallBack("start_game", {});
    }

  }

})
