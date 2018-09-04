import Controller from '@ember/controller'

export default Controller.extend({

  actions: {

    startNewGame() {
      this.transitionToRoute('home');
    }
  }

});
