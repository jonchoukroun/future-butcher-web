import Component from '@ember/component';
import { classNames, tagName } from '@ember-decorators/component';

@tagName('ol')
@classNames('scrolling-scores')

export default class ScrollingScoresComponent extends Component {

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);

    if (!this.scores) {
      this.socket.getScores().then((response) => {
        this.set('scores', response.state_data);
      })
    }
  }

}
