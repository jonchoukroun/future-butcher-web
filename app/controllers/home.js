import Controller from '@ember/controller'
import { get } from '@ember/object'

export default Controller.extend({

  actions: {

    startGame() {
      get(this, 'socket').pushCallBack("start_game", {}).then(() => {
        this.transitionToRoute('game');
      })
    }

  }
})
