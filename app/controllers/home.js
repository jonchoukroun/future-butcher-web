import Controller from '@ember/controller'
import { get, set } from '@ember/object'

export default Controller.extend({

  screen: 'intro',

  actions: {

    startGame() {
      get(this, 'socket').pushCallBack("start_game", {}).then(() => {
        this.transitionToRoute('bank');
      })
    },

    nextScreen() {
      set(this, 'screen', 'instructions');
    }

  }
})
