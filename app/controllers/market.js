import Controller from '@ember/controller'
import { computed, get } from '@ember/object'

export default Controller.extend({

  isInDebt: computed('socket.stateData.player.debt', function() {
    return get(this, 'socket.stateData.player.debt') > 0;
  }),

  currentStation: computed('socket.stateData.station.station_name', function() {
    return get(this, 'socket.stateData.station.station_name');
  }),

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

  actions: {

    reloadRoute() {
      this.transitionToRoute('market');
    },

    sendToScores() {
      this.transitionToRoute('high-scores');
    }

  }

})
