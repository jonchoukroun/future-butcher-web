import HomeScreenComponent from 'future-butcher-web/components/home/home-screen';
import { action, computed } from '@ember-decorators/object';

export default class IntroScreenComponent extends HomeScreenComponent {

  @computed()
  get currentDate() {
    const now   = new Date(Date.now());
    const date_string = new Date(2055, now.getMonth(), now.getDate(), 5, 0).toDateString();
    let date_array = date_string.split(' ');
    date_array.shift();
    return date_array.join(' ');
  }

  @action
  skipIntro() {
    this.get('sendSkipIntro')();
  }

}
