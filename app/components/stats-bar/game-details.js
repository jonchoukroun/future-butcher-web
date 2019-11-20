import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GameDetailsComponent extends Component {

  @service('tracking-service') trackingService;

  @action
  toggleStatsBar() {
    this.get('sendToggleStatsBar')("#gameDetails");
  }

  @action
  quitGame() {
    let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };

    this.get('socket').pushCallBack('end_game', payload).then(() => {
      this.get('trackingService').trackEvent('Ended game early');
      this.get('sendQuit')();
    });
  }

}
