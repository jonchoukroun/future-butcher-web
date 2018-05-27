import Controller    from '@ember/controller'
import { computed, get, set }  from '@ember/object'

export default Controller.extend({

  lastTurn: computed('socket.stateData.rules.turns_left', function() {
    return get(this, 'socket.stateData.rules.turns_left') === 0;
  }),


  actions: {

    retirePlayer() {
      let score = get(this, 'stateData.player.debt') === 0 ?
        get(this, 'stateData.player.funds') : null;
      if (score === 0) { score = null; }

      let payload = {
        score: score,
        hash_id: localStorage.getItem('player_hash')
      };

      get(this, 'socket').pushCallBack('end_game', payload);
      this.transitionToRoute('home');
    },

    navigate(station) {
      get(this, 'socket').pushCallBack('change_station', { destination: station });
      this.transitionToRoute('home');
    }

  }
})
