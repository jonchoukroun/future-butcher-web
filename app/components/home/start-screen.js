import HomeScreenComponent from 'future-butcher-web/components/home/home-screen';
import { action } from '@ember-decorators/object';

export default class IntroScreenComponent extends HomeScreenComponent {

  handleTutorialMessages() {
    if (this.get('isTutorialEnabled')) {
      localStorage.removeItem('closed-debt-tutorial');
      localStorage.removeItem('closed-funds-tutorial');
      localStorage.removeItem('closed-turns-tutorial');
    }
  }

  @action
  setTutorialSelection(selection) {
    this.set('isTutorialEnabled', selection);
  }

  @action
  startGame() {
    this.handleTutorialMessages();

    this.socket.pushCallBack("start_game", {}).then(() => {
      this.set('screen', 'intro');
      this.get('sendBankTransition')();
    })
  }

}
