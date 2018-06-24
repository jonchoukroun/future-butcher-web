import Component from '@ember/component'
import { get, observer, set } from '@ember/object'

export default Component.extend({

  tagName: 'ul',

  elementId: 'scrolling-scores',

  classNames: ['list-group'],

  retrieveScores: observer('socket.gameChannel', function() {
    if (get(this, 'socket.gameChannel')) {
      get(this, 'socket').getScores().then((response) => {
        set(this, 'scores', response.state_data);
      })
    }
  })
  
})
