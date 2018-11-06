import Component from '@ember/component';
import { classNames, tagName } from '@ember-decorators/component';

@tagName('ol')
@classNames('scrolling-scores')

export default class ScrollingScoresComponent extends Component {

  didReceiveAttrs() {
    this._super(...arguments);

    if (!this.scores) {
      this.socket.getScores().then((response) => {
        this.set('scores', response.state_data);
      })
    }
  }

}
