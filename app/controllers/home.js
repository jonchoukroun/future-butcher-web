import Controller from '@ember/controller'

export default Controller.extend({

  screen: 'intro',

  actions: {

    skipIntro() {
      set(this, 'screen', 'start');
    },

    nextScreen() {
      const screens = ['intro', 'packs', 'turns', 'start'];
      set(this, 'screen', screens[screens.indexOf(this.screen) + 1])
    },

    setTutorialSelection(selection) {
      set(this, 'isTutorialEnabled', selection);
    },

    startGame() {
      this.handleTutorialMessages();

      this.socket.pushCallBack("start_game", {}).then(() => {
        set(this, 'screen', 'intro');
        this.transitionToRoute('bank');
      })
    }

  }
})
