import Controller from '@ember/controller'

export default Controller.extend({

  actions: {
    returnToGame() {
      this.transitionToRoute('game');
    }
  }
})
