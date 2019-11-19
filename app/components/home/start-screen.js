import HomeScreenComponent from 'future-butcher-web/components/home/home-screen';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class IntroScreenComponent extends HomeScreenComponent {

  @service('tracking-service') trackingService;

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);

    this.get('socket').getScores().then((response) => {
      const lowest_score = response.state_data[99].score;
      this.set('current_rate', lowest_score);
    });
  }

  handleTutorialMessages() {
    if (this.get('isTutorialEnabled')) {
      localStorage.removeItem('closed-debt-tutorial');
      localStorage.removeItem('closed-funds-tutorial');
      localStorage.removeItem('closed-navigation-tutorial');
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
      this.get('trackingService').trackEvent('Clicked start game');
      this.get('sendMarketTransition')();
    })
  }

}
