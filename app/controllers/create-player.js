import Controller from '@ember/controller';

export default Controller.extend({

  actions: {

    signInPlayer() {
      this.transitionToRoute('home');
    }

  }

});
