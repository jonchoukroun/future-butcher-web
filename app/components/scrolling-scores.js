import Component from '@ember/component'
import { get, set } from '@ember/object'

export default Component.extend({

  tagName: 'ul',

  elementId: 'scrolling-scores',

  classNames: ['list-group'],

  didInsertElement() {
    this._super(...arguments);

    get(this, 'socket').getScores().then((response) => {
      set(this, 'scores', response.state_data);
    })
  },

})
