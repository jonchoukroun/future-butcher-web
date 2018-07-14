import Route from '@ember/routing/route'
import { get } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    localStorage.removeItem('player_score');
    this._validateParams();
  },

  model() {
    const socketService = get(this, 'socket');
    if (get(socketService, 'gameChannel')) { return; }

    const payload = {
      name: localStorage.getItem('player_name'),
      hash_id: localStorage.getItem('player_hash')
    };

    if (get(socketService, 'gameChannel')) { return; }

    socketService.openSocket().then((socket) => {
      socketService.joinChannel(socket, payload).then(() => {
        socketService.pushCallBack("new_game", {})
          .catch((response) => { this._handleExistingGame(response.reason); })
      })
    }) ;
  },

  _handleExistingGame(reason) {
    if (reason.indexOf(':already_started') > -1) {
      get(this, 'socket').restoreGameState(localStorage.getItem('player_name'));
    }
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
