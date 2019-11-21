import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { later } from '@ember/runloop';

import { muggerNames } from 'future-butcher-web/fixtures/mugger-names';

export default class MuggingInterfaceComponent extends Component {

  inFight = false;

  init() {
    super.init(...arguments);

    this.set('muggerName', this.getRandomName());

    this.set('startingFunds', this.get('socket.stateData.player.funds'));
    this.set('startingPack', this.get('socket.stateData.player.pack'));
    this.set('startingTurnsLeft', this.get('socket.stateData.rules.turns_left'));
  }

  @computed('socket.gameStatus')
  get inProgress() {
    return this.get('socket.gameStatus') === "mugging";
  }

  @computed('socket.stateData.player.funds')
  get playerFunds() {
    return this.get('socket.stateData.player.funds');
  }

  @computed('socket.stateData.player.pack')
  get totalCutsOwned() {
    return Object.values(this.get('socket.stateData.player.pack')).reduce((cut, acc) => {
      return cut + acc;
    });
  }

  @computed('socket.stateData.rules.turns_left')
  get turnsLeft() {
    return this.get('socket.stateData.rules.turns_left');
  }

  @computed('startingTurnsLeft', 'turnsLeft')
  get turnsLost() {
    return this.get('startingTurnsLeft') - this.get('turnsLeft');
  }

  @computed('startingFunds', 'playerFunds')
  get fundsLost() {
    return this.get('startingFunds') - this.get('playerFunds');
  }

  @computed('startingPack', 'socket.stateData.player.pack')
  get cutLost() {
    const starting_pack = this.get('startingPack');
    const current_pack  = this.get('socket.stateData.player.pack');

    let cut_lost = new Object();
    Object.keys(current_pack).map(cut => {
      const d = starting_pack[cut] - current_pack[cut];
      if (d > 0) {
        cut_lost[cut] = d;
      }
    });

    return cut_lost;
  }

  @computed('cutLost')
  get hasLostCut() {
    return Object.entries(this.get('cutLost'));
  }

  @computed('startingPack', 'socket.stateData.player.pack')
  get cutsHarvested() {
    const starting_pack = this.get('startingPack');
    const current_pack  = this.get('socket.stateData.player.pack');

    return Object.keys(current_pack).filter(cut => current_pack[cut] > starting_pack[cut]);
  }

  @computed('cutsHarvested')
  get hasHarvestedCuts() {
    return this.get('cutsHarvested').length;
  }

  getRandomName() {
    return muggerNames[Math.floor(Math.random() * Math.floor(muggerNames.length))];
  }

  handleFightState() {
    later(() => {
      this.set('inFight', false);
    }, 300);
  }

  @action
  fightMugger() {
    this.set('inFight', true);
    this.get('socket').pushCallBack("fight_mugger", {}).then(() => {
      this.handleFightState();
    })
  }

  @action
  bribeMugger() {
    this.set('inFight', true);
    this.get('socket').pushCallBack("bribe_mugger", {}).then(() => {
      this.handleFightState();
    })
  }

}
