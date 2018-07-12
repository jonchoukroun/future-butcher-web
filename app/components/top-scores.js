import Component from '@ember/component'
import { computed, get, set } from '@ember/object'

export default Component.extend({

  scores: computed('socket.stateData', function() {
    return get(this, 'socket.stateData');
  }),

  highestScore: computed('scores', function() {
    return get(this, 'scores.firstObject');
  }),

  playerScoreIndex: computed('scores', 'playerScore', function() {
    return Object.values(get(this, 'scores')).map(i => i.score).indexOf(get(this, 'playerScore'));
  }),

  higherScores: computed('scores', 'playerScoreIndex', function() {
    const scores = get(this, 'scores');
    return [2, 1].map(n => {
      let rank = get(this, 'playerScoreIndex') - n;
      if (rank < 0) { return; }

      let obj = new Object;
      obj.player = scores[rank].player;
      obj.score = scores[rank].score;
      obj.rank = rank + 1;

      return obj;
    }).filter(el => el !== undefined);
  }),

  lowerScores: computed('scores', 'playerScoreIndex', function() {
    const scores = get(this, 'scores');
    return [1, 2].map(n => {
      let rank = get(this, 'playerScoreIndex') + n;

      let obj = new Object;
      obj.player = scores[rank].player;
      obj.score = scores[rank].score;
      obj.rank = rank + 1;

      return obj;
    });
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
  }

})
