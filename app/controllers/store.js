import Controller from '@ember/controller'

export default Controller.extend({

  actions: {

    sendToScores() {
      this.transitionToRoute('high-scores');
    }

  }

})