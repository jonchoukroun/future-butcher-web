import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

export default class HighScoresController extends Controller {

  @service('tracking-service') trackingService;

  @action
  startNewGame() {
    this.get('trackingService').trackEvent('Clicked start new game');
    this.transitionToRoute('home');
  }

}
