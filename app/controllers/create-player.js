import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class CreatePlayerController extends Controller {

  @action
  signInPlayer() {
    this.transitionToRoute('home');
  }

}
