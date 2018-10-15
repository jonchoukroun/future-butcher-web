import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';

export default class AllScoresController extends Controller {

  @action
  sendToScores() {
    this.transitionToRoute('high-scores');
  }

}
