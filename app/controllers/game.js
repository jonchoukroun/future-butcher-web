import Controller from '@ember/controller'
import { computed, get, set } from '@ember/object'
import { subwayStations } from '../fixtures/subway-stations'

export default Controller.extend({

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

  isFirstTurn: computed('turnsLeft', function() {
    return get(this, 'turnsLeft') === 24;
  }),

  isSecondTurn: computed('turnsLeft', function() {
    return get(this, 'turnsLeft') === 23;
  }),

  currentDebt: computed('isSecondTurn', function() {
    if (get(this, 'isSecondTurn')) {
      return get(this, 'socket.stateData.player.principle');
    }
  }),

  currentStation: computed('socket.stateData.station.station_name', function() {
    return subwayStations.map(station => {
      if (station.name === get(this, 'socket.stateData.station.station_name')) {
        return station.display
      }
    }).filter((el) => el )[0];
  }),

  actions: {

    sendToScores() {
      this.transitionToRoute('high-scores');
    },

    startNewGame() {
      set(this, 'showGameContinuePrompt', false);
      const socketService = get(this, 'socket');
      const payload       = { hash_id: localStorage.getItem('player_hash'), score: 0 };
      socketService.pushCallBack("end_game", payload).then(() => {
        this.transitionToRoute('home');
      });
    }
  }

})
