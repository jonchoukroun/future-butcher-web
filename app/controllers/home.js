import Controller from '@ember/controller'
import { get, set } from '@ember/object'

export default Controller.extend({

  screen: 'intro',

  handleTutorialMessages() {
    if (get(this, 'isTutorialEnabled')) {
      localStorage.removeItem('closed-debt-tutorial');
      localStorage.removeItem('closed-funds-tutorial');
      localStorage.removeItem('closed-turns-tutorial');
    }
  },

  actions: {

    setTutorialSelection(selection) {
      set(this, 'isTutorialEnabled', selection);
    },

    startGame() {
      this.handleTutorialMessages();

      get(this, 'socket').pushCallBack("start_game", {}).then(() => {
        this.transitionToRoute('bank');
      })
    },

    nextScreen() {
      set(this, 'screen', 'instructions');
    }

  }
})
