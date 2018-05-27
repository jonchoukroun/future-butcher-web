import Component         from '@ember/component'
import { computed, get } from '@ember/object'

export default Component.extend({

  tagName: 'ul',

  elementId: 'scrolling-scores',

  classNames: ['list-group'],

  scores: computed('socket.orderedScores', function() {
    return get(this, 'socket.orderedScores');
  })
})
