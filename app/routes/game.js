import Route from '@ember/routing/route'
import { get, observer, set } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    if (get(this, 'socket.gameStatus') !== 'in_game') {
      this._attemptChannelConnection();
    }
  },

  hasFailedRestore: observer('socket.gameRestoreSuccess', function() {
    if (!get(this, 'socket.gameRestoreSuccess')) {
      this.replaceWith('home');
    }
  }),

  _attemptChannelConnection() {
    const socketService = get(this, 'socket');
    const payload = {
      name: localStorage.getItem('player_name'),
      hash_id: localStorage.getItem('player_hash')
    }

    if (!name || !hash_id) {
      this.transitionTo('home');
    } else {
      socketService.openSocket()
        .then((socket) => { socketService.joinChannel(socket, payload); })
        .then(() => { socketService.restoreGameState(payload.name); })
    }
  }

})
