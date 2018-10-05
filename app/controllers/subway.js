import Controller from '@ember/controller'
import { computed, get } from '@ember/object'
import { subwayStations } from '../fixtures/subway-stations'

export default Controller.extend({

  turnsLeft: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left');
  }),

  isLastTurn: computed('turnsLeft', function() {
    return get(this, 'turnsLeft') === 0;
  }),

  cheapestEntry: computed(function() {
    const hollywood_rate = subwayStations.filter(el =>
      el.name === "hollywood").get('firstObject.base_crime_rate');

    const next_turn = 25 - get(this, 'turnsLeft');
    const fee = (2 * (5 - hollywood_rate)) * Math.pow(next_turn, 2) - (100 * hollywood_rate) + 500
    return Math.round(fee);
  }),

  playerFunds: computed('socket.stateData.player.funds', function() {
    return get(this, 'socket.stateData.player.funds');
  }),

  totalInventoryValue: computed('socket.stateData.player.pack', 'socket.stateData.station.market',
  function() {
    const pack = get(this, 'socket.stateData.player.pack');
    const market = get(this ,'socket.stateData.station.market');
    return Object.keys(pack).reduce((sum, cut) => {
      return sum + (pack[cut] * market[cut].price);
    }, 0);
  }),

  totalPlayerValue: computed('playerFunds', 'totalInventoryValue', function() {
    return get(this, 'playerFunds') + get(this, 'totalInventoryValue');
  }),

  gameOverState: computed('socket.stateData.station.station_name', 'totalPlayerValue',
  'cheapestEntry', function() {
    if (get(this, 'socket.stateData.station.station_name') === 'compton') {
      return get(this, 'cheapestEntry') > get(this, 'totalPlayerValue');
    }

    return false;
  }),

  endGame(payload, redirect) {
    get(this, 'socket').pushCallBack('end_game', payload).then(() => {
      this.transitionToRoute(redirect);
    });
  },

  actions: {

    sendToScores() {
      this.transitionToRoute('high-scores');
    },

    sendEndGame(payload) {
      this.endGame(payload);
    },

    payDebt() {
      get(this, 'socket').pushCallBack("pay_debt", { amount: get(this, 'playerDebt') });
    },

    quitGame() {
      let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };
      this.endGame(payload, 'high-scores');
    },

    startOver() {
      let payload = { hash_id: localStorage.getItem('player_hash'), score: 0 };
      this.endGame(payload, 'home');
    },

    navigate(station) {
      let payload = { destination: station };
      get(this, 'socket').pushCallBack('change_station', payload).then(() => {
        this.transitionToRoute('traveling');
      });
    }

  }
})
