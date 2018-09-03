import Controller from '@ember/controller'
import { get, observer  } from '@ember/object'

export default Controller.extend({

  actions: {

    startNewGame() {
      this.transitionToRoute('home');
    }
  }

});
