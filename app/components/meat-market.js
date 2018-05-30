import Component from '@ember/component'
import { computed, get } from '@ember/object'

export default Component.extend({

  elementId: 'meat-market',

  tagName: 'ul',

  classNames: ['list-group-flush', 'px-2'],

  marketCuts: computed('gameStatus', 'socket.stateData.station.market', function() {
    if (get(this, 'socket.gameStatus') !== 'in_game') { return; }

    return get(this, 'socket.stateData.station.market');
  })

})
