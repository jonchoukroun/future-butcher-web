import Component from '@ember/component';
import { action } from '@ember/object';

export default class HomeScreenComponent extends Component {

  @action
  nextScreen() {
    this.get('sendNextScreen')();
  }

  @action
  skipIntro() {
    this.get('sendSkipIntro')();
  }

}
