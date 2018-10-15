import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';

export default class HighScoresController extends Controller {

  @action
  startNewGame() {
    this.transitionToRoute('home');
  }

}
