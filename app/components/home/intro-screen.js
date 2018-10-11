import HomeScreenComponent from 'future-butcher-web/components/home/home-screen';
import { action } from '@ember-decorators/object';

export default class IntroScreenComponent extends HomeScreenComponent {

  @action
  skipIntro() {
    this.get('sendSkipIntro')();
  }

}
