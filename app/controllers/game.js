import Controller from '@ember/controller'
import { computed, get, set } from '@ember/object'

export default Controller.extend({

  actions: {

    showGameContinuePrompt: false,      // make conditional on reloading game

    continueGame() {
      set(this, 'showGameContinuePrompt', false);
    },

    startNewGame() {
      set(this, 'showGameContinuePrompt', false);
      const socketService = get(this, 'socket');
      const payload       = { hash_id: localStorage.getItem('player_hash'), score: 0 };
      socketService.pushCallBack("end_game", payload).then(() => {
        this.transitionToRoute('home');
      });
    }
  }

})
