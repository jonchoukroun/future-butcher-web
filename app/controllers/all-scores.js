import Controller from '@ember/controller'
import { get, set } from '@ember/object'

export default Controller.extend({

  actions: {

    sendToScores() {
      this.transitionToRoute('high-scores');
    }
    
  }

})
