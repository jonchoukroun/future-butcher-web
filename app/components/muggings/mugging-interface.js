import Component from '@ember/component';
import { computed, get, set } from '@ember/object';

export default Component.extend({

  init() {
    this._super(...arguments);

    set(this, 'startingFunds', get(this, 'socket.stateData.player.funds'));
    set(this, 'startingPack', get(this, 'socket.stateData.player.pack'));
    set(this, 'startingTurnsLeft', get(this, 'socket.stateData.rules.turns_left'));
  },

  playerFunds: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  totalCutsOwned: computed('socket.stateData.player.pack', function() {
    return Object.values(get(this, 'socket.stateData.player.pack')).reduce((cut, acc) => {
      return cut + acc;
    });
  }),

  inProgress: computed('socket.gameStatus', function() {
    return get(this, 'socket.gameStatus') === "mugging";
  }),

  turnsLost: computed('startingTurnsLeft', 'socket.stateData.rules.turns_left', function() {
    return get(this, 'startingTurnsLeft') - get(this, 'socket.stateData.rules.turns_left');
  }),

  fundsLost: computed('startingFunds', 'playerFunds', function() {
    return get(this, 'startingFunds') - get(this, 'playerFunds');
  }),

  cutsLost: computed('startingPack', 'socket.stateData.player.pack', function() {
    const startingPack = get(this, 'startingPack');
    console.log('startingPack', startingPack);
    const currentPack  = get(this, 'socket.stateData.player.pack');
    console.log('currentPack', currentPack);
    let lostCuts = new Map();
    Object.keys(currentPack).map(cut => { lostCuts[cut] = startingPack[cut] - currentPack[cut]; });
    console.log('prefilter', lostCuts);
    let filteredCuts = new Map();
    Object.keys(lostCuts).filter(cut => lostCuts[cut] > 0).map(cut => {
      filteredCuts[cut] = lostCuts[cut];
    });
    console.log('filtered', filteredCuts);
    return filteredCuts;
  }),

  hasLostCuts: computed('cutsLost', function() {
    return Object.entries(get(this, 'cutsLost'));
  }),

  actions: {

    fightMugger() {
      get(this, 'socket').pushCallBack("fight_mugger", {}).then((res) => {
        console.log('sent fight mugger, handle rest', res.state_data);
      })
    },

    offerCash() {
      get(this, 'socket').pushCallBack("pay_mugger", {"response": "funds"}).then(res => {
        console.log('sent pay mugger :funds', res.state_data);
      })
    },

    offerCuts() {
      get(this, 'socket').pushCallBack("pay_mugger", {"response": "cuts"}).then(res => {
        console.log('sent pay mugger :cuts', res.state_data);
      })
    }

  }

});
