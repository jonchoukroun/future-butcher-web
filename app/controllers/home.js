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

    skipIntro() {
      set(this, 'screen', 'start');
    },

    nextScreen() {
      const screens = ['intro', 'packs', 'tokens', 'start'];
      set(this, 'screen', screens[screens.indexOf(get(this, 'screen')) + 1])
    },

    setTutorialSelection(selection) {
      set(this, 'isTutorialEnabled', selection);
    },

    startGame() {
      this.handleTutorialMessages();

      get(this, 'socket').pushCallBack("start_game", {}).then(() => {
        set(this, 'screen', 'intro');
        this.transitionToRoute('bank');
      })
    }

  }
})
