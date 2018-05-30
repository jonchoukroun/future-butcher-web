import Component         from '@ember/component'
import { computed, get } from '@ember/object'

export default Component.extend({

  elementId: 'expanded-game-stats',

  hasOpenedInventory: computed('localStorage.expanded_inventory', function() {
    return localStorage.getItem('expanded_inventory') > 1;
  }),

  playerFunds: computed('socket.stateData.player.funds', function() {
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

  playerHealth: computed('socket.stateData.player.health', function() {
    return get(this, 'socket.stateData.player.health');
  }),

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

  actions: {

    sendCollapseStats() {
      get(this, 'sendCollapseStats')();
    }

  }
})
