import Route from '@ember/routing/route'
import { get } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    if (get(this, 'socket.gameChannel')) { return; }
    this._validateParams();
  },

  model() {
    let playerName = localStorage.getItem('player_name');
    let playerHash = localStorage.getItem('player_hash');

    return get(this, 'socket').reJoinChannel({ name: playerName, hash_id: playerHash });
  },

  _validateParams() {
    let playerName = localStorage.getItem('player_name');
    let playerHash = localStorage.getItem('player_hash');

    if (!playerName || playerName.length < 3 || !playerHash) {
      localStorage.removeItem('player_name');
      localStorage.removeItem('player_hash');
      this.replaceWith('create-player');
    }
  }


})
