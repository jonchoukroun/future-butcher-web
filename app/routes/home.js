import Route from '@ember/routing/route'
import { get, set } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    const playerName = localStorage.getItem('player_name');
    const playerHash = localStorage.getItem('player_hash');

    if (!playerName || !playerHash) {
      return this.replaceWith('create-player');
    } else {
      this.handleJoinChannel(playerName, playerHash);
    }
  },

  setupController(controller) {
    this._super(...arguments);

    if (localStorage.getItem('player_score')) {
      set(controller, 'screen', 'instructions');
      localStorage.removeItem('player_score');
    }
  },


  handleJoinChannel(name, hash_id) {
    get(this, 'socket').openSocket().then((socket) => {
      if (get(this, 'socket.gameChannel.state') === "joined") {
        this.initializeGame(name);
      } else {
        this.joinGameChannel(socket, name, hash_id);
      }
    })
  },

  joinGameChannel(socket, name, hash_id) {
    if (!name || !hash_id) { return this.replaceWith('create-player'); }

    const socketService = get(this, 'socket');
    socketService.joinChannel(socket, { name: name, hash_id: hash_id }).then(() => {
      this.initializeGame(name);
    })
  },

  initializeGame(name) {
    const socketService = get(this, 'socket');

    socketService.pushCallBack("new_game", {})
      .catch((response) => {
        this.handleExistingGame(socketService, response.reason, name);
      })
  },

  handleExistingGame(socketService, reason, name) {
    if (reason.indexOf(":already_started") > -1) {
      socketService.restoreGameState(name).then(() => {
        if (get(socketService, 'gameStatus') === "initialized") {
          return;
        } else {
          return this.replaceWith('market');
        }
      });
    }
  }

})
