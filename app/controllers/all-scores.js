import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AllScoresController extends Controller {

  @action
  sendToScores() {
    this.transitionToRoute('high-scores');
  }

}
