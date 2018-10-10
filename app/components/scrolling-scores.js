import Component from '@ember/component'
import { get, set } from '@ember/object'

export default Component.extend({

  didReceiveAttrs() {
    this._super(...arguments);

    if (!this.scores) {
      this.socket.getScores().then((response) => {
        set(this, 'scores', response.state_data);
      })
    }
  },

  tagName: 'ol',

  elementId: 'scrolling-scores',

  classNames: ['display-text']

})
