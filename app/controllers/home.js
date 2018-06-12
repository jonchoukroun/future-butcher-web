import Controller from '@ember/controller'
import { get, observer } from '@ember/object'

export default Controller.extend({

  gameStarted: observer('socket.gameStatus', function() {
    if (get(this, 'socket.gameStatus')) {
      this.transitionToRoute('game');
    }
  }),

  actions: {

    startGame() {
      get(this, 'socket').pushCallBack("new_game", {}).then(() => {
        get(this, 'socket').pushCallBack("start_game", {});
      })
    }

  }
})
