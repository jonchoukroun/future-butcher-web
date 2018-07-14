import Route from '@ember/routing/route'
import { get, observer } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    if (get(this, 'socket.gameStatus') !== 'in_game') {
      this._attemptChannelConnection();
    }

    if (get(this, 'socket.gameStatus') !== 'random_encounter') {
      this.replaceWith('market');
    }
  },

  hasFailedRestore: observer('socket.gameRestoreSuccess', function() {
    if (!get(this, 'socket.gameRestoreSuccess')) {
      this.replaceWith('home');
    }
  }),

  _attemptChannelConnection() {
    const socketService = get(this, 'socket');
    let payload = {
      name: localStorage.getItem('player_name'),
    }

    let hash_id = localStorage.getItem('player_hash')
    if (hash_id) { payload.hash_id = hash_id }

    if (!name || !hash_id) {
      this.transitionTo('home');
    } else {
      socketService.openSocket()
        .then((socket) => { socketService.joinChannel(socket, payload); })
        .then(() => { socketService.restoreGameState(payload.name); })
    }
  }

})
