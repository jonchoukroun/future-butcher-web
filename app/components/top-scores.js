import Component from '@ember/component'
import { computed, get, set } from '@ember/object'

export default Component.extend({

  scores: computed('socket.stateData', function() {
    return get(this, 'socket.stateData');
  }),

  highestScore: computed('scores', function() {
    return get(this, 'scores.firstObject');
  }),

  lowestScore: computed('scores', function() {
    return get(this, 'scores.lastObject.score');
  }),

  isHighestScore: computed('playerScore', 'highestScore', function() {
    return get(this, 'playerScore') === get(this, 'highestScore.score') &&
      get(this, 'playerName') === get(this, 'highestScore.player');
  }),

  isBelowTopScores: computed('playerScore', 'lowestScore', function() {
    return get(this, 'playerScore') < get(this, 'lowestScore');
  }),

  didReceiveAttrs() {
    this._super(...arguments);

    set(this, 'playerName', localStorage.getItem('player_name'));
    set(this, 'playerScore', parseInt(localStorage.getItem('player_score')));
  },

})
