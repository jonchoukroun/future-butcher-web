import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TopScoresComponent extends Component {

  @service('tracking-service') trackingService;

  @computed('socket.stateData')
  get scores() {
    return this.get('socket.stateData');
  }

  @computed('scores')
  get highestScore() {
    return this.get('scores.firstObject');
  }

  @computed('scores', 'playerScore')
  get playerScoreIndex() {
    return Object.values(this.get('scores')).map(i => i.score).indexOf(this.get('playerScore'));
  }

  @computed('scores', 'playerScoreIndex')
  get higherScores() {
    const scores = this.get('scores');
    return [2, 1].map(n => {
      let rank = this.get('playerScoreIndex') - n;
      if (rank < 0) { return []; }

      let obj = new Object;
      obj.player = scores[rank].player;
      obj.score = scores[rank].score;
      obj.rank = rank + 1;

      return obj;
    }).filter(el => el !== undefined);
  }

  @computed('scores', 'playerScoreIndex')
  get lowerScores() {
    const scores = this.get('scores');
    return [1, 2].map(n => {
      let rank = this.get('playerScoreIndex') + n;

      let obj = new Object;
      obj.player = scores[rank].player;
      obj.score = scores[rank].score;
      obj.rank = rank + 1;

      return obj;
    });
  }

  @computed('playerScore', 'highestScore')
  get isHighestScore() {
    const isHighestScore = this.get('playerScore') === this.get('highestScore.score') &&
      this.get('playerName') === this.get('highestScore.player');

    if (isHighestScore) {
      const payload = { high_score: this.get('playerScore') };
      this.get('trackingService').trackEvent('Set new high score', payload);
    }

    return isHighestScore;
  }

  @computed('playerScore', 'lowestScore')
  get isBelowTopScores() {
    return this.get('playerScore') < this.get('lowestScore');
  }

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);

    this.set('playerName', localStorage.getItem('player_name'));
    this.set('playerScore', parseInt(localStorage.getItem('player_score')));
  }

}
