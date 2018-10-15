import Route from '@ember/routing/route'

export default class HomeRoute extends Route {

  beforeModel() {
    this._super(...arguments);

    const playerName = localStorage.getItem('player_name');
    const playerHash = localStorage.getItem('player_hash');

    if (!playerName || !playerHash) {
      return this.replaceWith('create-player');
    } else {
      this.handleJoinChannel(playerName, playerHash);
    }
  }

  setupController(controller) {
    this._super(...arguments);

    if (localStorage.getItem('player_score')) {
      controller.set('screen', 'intro');
      localStorage.removeItem('player_score');
    }
  }

  handleJoinChannel(name, hash_id) {
    this.socket.openSocket().then((socket) => {
      if (this.get('socket.gameChannel.state') === "joined") {
        this.initializeGame(name);
      } else {
        this.joinGameChannel(socket, name, hash_id);
      }
    })
  }

  joinGameChannel(socket, name, hash_id) {
    if (!name || !hash_id) {
      return this.replaceWith('create-player');
    }

    const socketService = this.socket;
    socketService.joinChannel(socket, { name: name, hash_id: hash_id }).then(() => {
      this.initializeGame(name);
    });
  }

  initializeGame(name) {
    const socketService = this.socket;

    socketService.pushCallBack("new_game", {}).catch((response) => {
      this.handleExistingGame(socketService, response.reason, name);
    });
  }

  handleExistingGame(socketService, reason, name) {
    if (reason.indexOf(":already_started") > -1) {
      socketService.restoreGameState(name).then(() => {
        if (socketService.get('gameStatus') === "initialized") {
          return;
        } else {
          return this.replaceWith('market');
        }
      });
    }
  }

}
