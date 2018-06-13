import Route from '@ember/routing/route'
import { get } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    let playerName = localStorage.getItem('player_name');
    let playerHash = localStorage.getItem('player_hash');

    if (get(this, 'socket.gameChannel')) { return; }

    if (playerName && playerName.length > 2 && playerHash) {
      get(this, 'socket').connect({ name: playerName, hash_id: playerHash });
    } else {
      localStorage.removeItem('player_name');
      localStorage.removeItem('player_hash');
      this.replaceWith('create-player');
    }
  }

})
