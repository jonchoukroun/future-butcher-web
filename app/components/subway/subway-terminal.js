import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service'

export default class SubwayTerminalComponent extends Component {

  @service('tracking-service') TrackingService;

  @computed('socket.stateData.station.station_name')
  get currentStation() {
    return this.get('socket.stateData.station.station_name');
  }

  @computed('socket.stateData.player')
  get playerStats() {
    return this.get('socket.stateData.player');
  }

  @computed('playerStats.funds')
  get playerFunds() {
    return this.get('playerStats.funds');
  }

  @computed('playerStats.debt')
  get playerDebt() {
    return this.get('playerStats.debt');
  }

  @computed('playerStats.pack')
  get totalCutsOwned() {
    return Object.values(this.get('playerStats.pack')).reduce((sum, cut) => {
      return sum += cut;
    });
  }

  @computed('playerDebt', 'totalCutsOwned')
  get hasLooseEnds() {
    return this.get('playerDebt') || this.get('totalCutsOwned') > 0;
  }

  @action
  payDebt() {
    this.get('socket').pushCallBack("pay_debt", {});
  }

  @action
  retirePlayer() {
    let score = this.get('playerDebt') === 0 ?
      this.get('socket.stateData.player.funds') : null;
    if (score === 0) { score = null; }

    localStorage.setItem('player_score', score);

    const payload = {
      score: score,
      hash_id: localStorage.getItem('player_hash')
    };

    if (score && score > 0) {
      const tracking_payload = {
        score: score,
        player_name: localStorage.getItem('player_name')
      }

      this.get('TrackingService').trackEvent('Saved high score', tracking_payload);
    }

    this.get('sendEndGame')(payload);
  }

}
