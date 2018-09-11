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
    const currentPack  = get(this, 'socket.stateData.player.pack');
    let lostCuts = new Object();
    Object.keys(currentPack).map(cut => {
      const d = startingPack[cut] - currentPack[cut];
      if (d > 0) {
        lostCuts[cut] = d;
      }
    })
    return lostCuts;
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
