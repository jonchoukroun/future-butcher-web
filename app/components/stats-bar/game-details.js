import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class GameDetailsComponent extends Component {

  @action
  toggleStatsBar() {
    this.get('sendToggleStatsBar')("#gameDetails");
  }

  @action
  quitGame() {
    let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };

    this.get('socket').pushCallBack('end_game', payload).then(() => {
      this.get('sendQuit')();
    });
  }

}
