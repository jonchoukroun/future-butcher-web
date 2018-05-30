import Controller from '@ember/controller'

export default Controller.extend({

  actions: {

    redirectToGame() {
      this.transitionToRoute('game');
    }

  }
})
