import Component from '@ember/component'
import { computed, get } from '@ember/object'
import { subwayStations } from '../fixtures/subway-stations'

export default Component.extend({

  elementId: 'subway-stations',

  classNames: ['list-group', 'w-100'],

  stations: computed(function() {
    return subwayStations;
  }),

  stateData: computed('socket.stateData', function() {
    return get(this, 'socket.stateData');
  }),

  currentStation: computed('stateData.station.station_name', function() {
    return get(this, 'stateData.station.station_name');
  }),

  actions: {

    selectStation(station) {
      get(this, 'sendStation')(station);
    }
  }

})
