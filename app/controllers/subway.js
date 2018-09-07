import Controller from '@ember/controller'
import { computed, get } from '@ember/object'

export default Controller.extend({

  isLastTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left') === 0;
  }),

  endGame(payload) {
    get(this, 'socket').pushCallBack('end_game', payload).then(() => {
      this.transitionToRoute('high-scores');
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
      this.endGame(payload);
    },

    navigate(station) {
      let payload = { destination: station };
      get(this, 'socket').pushCallBack('change_station', payload).then((res) => {
        this.transitionToRoute('traveling');
      });
    }

  }
})
