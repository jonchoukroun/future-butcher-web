import HomeScreenComponent from 'future-butcher-web/components/home/home-screen';
import { action, computed } from '@ember-decorators/object';

export default class IntroScreenComponent extends HomeScreenComponent {

  @computed()
  get currentDate() {
    const now   = new Date(Date.now());
    const month = now.getMonth();
    const date  = now.getDate();
    return new Date(2055, month - 1, date, 5, 0).toDateString()
  }

  @action
  skipIntro() {
    this.get('sendSkipIntro')();
  }

}
