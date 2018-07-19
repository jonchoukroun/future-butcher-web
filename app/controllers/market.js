import Controller from '@ember/controller'

export default Controller.extend({

  actions: {

    reloadRoute() {
      this.transitionToRoute('market');
    },

    sendToScores() {
      this.transitionToRoute('high-scores');
    }
  }

})
