import Component         from '@ember/component'
import { computed, get } from '@ember/object'

export default Component.extend({

  elementId: 'expanded-game-stats',

  tutorialMode: computed('localStorage.stats_expanded_count', function() {
    return localStorage.getItem('stats_expanded_count') > 4;
  }),

  cash: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  currentDebt: computed('socket.stateData.player.debt', function() {
    return get(this, 'socket.stateData.player.debt');
  }),

  playerPack: computed('socket.stateData.player.pack', function() {
    let pack = get(this, 'socket.stateData.player.pack');
    return pack;
  }),

  totalCutsOwned: computed('socket.stateData.player.pack', function() {
    let pack = get(this, 'socket.stateData.player.pack');
    return Object.values(pack).reduce((sum, cut) => { return sum + cut; });
  }),

  packSpaceAvailable: computed('totalCutsOwned', function() {
    let totalCuts = get(this, 'totalCutsOwned');
    if (totalCuts === 20) { return "Full"; }

    return 20 - totalCuts;
  }),

  actions: {

    sendCollapseStats() {
      get(this, 'sendCollapseStats')();
    }

  }
})
