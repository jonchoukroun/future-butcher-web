import Controller from '@ember/controller'
import { computed, get, observer, set } from '@ember/object'

export default Controller.extend({

  screen: 'welcome',

  isSeasonedVeteran: computed('localStorage.games_played', function() {
    return localStorage.getItem('games_played') > 2;
  }),

  gameStarted: observer('socket.gameStatus', function() {
    if (get(this, 'socket.gameStatus')) {
      this.transitionToRoute('game');
    }
  }),

  pushStartGame() {
    get(this, 'socket').pushCallBack("start_game", {});
  },

  handleExistingGame(reason) {
    if (reason.indexOf(':already_started') > -1) {
      get(this, 'socket').restoreGameState(localStorage.getItem('player_name'));
    }
  },

  actions: {

    clickNextScreen() {
      set(this, 'screen', 'start');
    },

    clickBackScreen() {
      set(this, 'screen', 'welcome');
    },

    startGame() {
      set(this, 'screen', 'welcome');
      const socketService = get(this, 'socket');
      socketService.pushCallBack("new_game", {})
        .then(() => { this.pushStartGame(); })
        .catch((response) => { this.handleExistingGame(response.reason); })
    }

  }
})
