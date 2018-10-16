import Component from '@ember/component';
import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { classNames } from '@ember-decorators/component';

@classNames('fixed-bottom', 'full-width-bar', 'row', 'justify-content-center', 'm-0', 'p-0', 'bg-black')
export default class NavBarComponent extends Component {

  @service router;

  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @computed('router.currentRouteName')
  get currentRoute() {
    return this.get('router.currentRouteName');
  }

  @computed('socket.stateData.station.station_name')
  get currentStation() {
    return this.get('socket.stateData.station.station_name');
  }

}