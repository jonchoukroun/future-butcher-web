import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { classNames } from '@ember-decorators/component';

import { subwayStations } from 'future-butcher-web/fixtures/subway-stations';

@classNames('subway-stations', 'list-group', 'w-100')

export default class subwayStationsComponent extends Component {

  @computed()
  get stations() {
    return subwayStations;
  }

  @computed('socket.stateData')
  get stateData() {
    return this.get('socket.stateData');
  }

  @computed('stateData.station.station_name')
  get currentStation() {
    return this.get('stateData.station.station_name');
  }

  @action
  selectStation(station) {
    this.get('sendStation')(station);
  }

}
