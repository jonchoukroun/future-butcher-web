import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class HomeController extends Controller {

  screen = "intro";

  @action
  skipIntro() {
    this.set('screen', 'start');
  }

  @action
  nextScreen() {
    const screens = ['intro', 'turns', 'start'];
    this.set('screen', screens[screens.indexOf(this.screen) + 1])
  }

  @action
  sendToMarket() {
    this.transitionToRoute('market');
  }

}
