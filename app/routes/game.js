import Route from '@ember/routing/route'
import { get, observer } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    if (get(this, 'socket.gameStatus') !== 'in_game') {
      this._attemptChannelConnection();
    }
  },

  hasFailedRestore: observer('socket.gameRestore', function() {
    if (get(this, 'socket.gameRestore') === 'failed') {
      this.replaceWith('home');
    }
  }),

  _attemptChannelConnection() {
    const name    = localStorage.getItem('player_name');
    const hash_id = localStorage.getItem('player_hash');

    if (!name || !hash_id) {
      this.transitionTo('home');
    } else {
      get(this, 'socket').connect({name: name, hash_id: hash_id});
    }
  }

})
