import Controller from '@ember/controller'
import { computed, get, set } from '@ember/object'
import { subwayStations } from '../fixtures/subway-stations'

export default Controller.extend({

  currentStation: computed('socket.stateData.station.station_name', function() {
    return subwayStations.map(station => {
      if (station.name === get(this, 'socket.stateData.station.station_name')) {
        return station.display
      }
    }).filter((el) => el )[0];
  }),

  actions: {

    showGameContinuePrompt: false,      // make conditional on reloading game

    continueGame() {
      set(this, 'showGameContinuePrompt', false);
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
