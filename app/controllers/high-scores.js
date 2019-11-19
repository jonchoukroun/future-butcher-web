import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HighScoresController extends Controller {

  @service('tracking-service') trackingService;

  @action
  startNewGame() {
    this.get('trackingService').trackEvent('Clicked start new game');
    this.transitionToRoute('home');
  }

}
