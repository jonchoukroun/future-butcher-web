import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { storeItems } from 'future-butcher-web/fixtures/store-items';
import { victoryQuotes } from 'future-butcher-web/fixtures/mugging-quotes';

export default Component.extend({

  cutsHarvested: null,

  playerWeapon: computed('socket.stateData.player.weapon', function() {
    return storeItems[get(this, 'socket.stateData.player.weapon')].display;
  }),

  randomVictoryQuote: computed(function() {
    return victoryQuotes[Math.floor(Math.random() * Math.floor(victoryQuotes.length))];
  }),

  cutsList: computed('cutsHarvested', function() {
    let cuts = get(this, 'cutsHarvested');

    if (!cuts.length) { return null;}

    if (cuts.length === 1) {
      return cuts[0];
    } else if (cuts.length === 2) {
      return `${cuts[0]} and ${cuts[1]}`;
    } else {
      cuts.map((el, i) => {
        console.log('cutsList | el', el);
        console.log('cutsList | i', i);
        if (i === cuts.length - 1) {
          return "and " + el;
        } else {
          return el;
        }
      }).join(", ");
    }
  })

});
