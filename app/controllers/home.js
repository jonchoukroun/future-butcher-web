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

  actions: {

    clickNextScreen() {
      set(this, 'screen', 'start');
    },

    clickBackScreen() {
      set(this, 'screen', 'welcome');
    },

    startGame() {
      set(this, 'screen', 'welcome');
      get(this, 'socket').pushCallBack("new_game", {}).then(() => {
        get(this, 'socket').pushCallBack("start_game", {});
      });
    }

  }
})
