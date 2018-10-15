import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

import { storeItems } from 'future-butcher-web/fixtures/store-items';
import { victoryQuotes } from 'future-butcher-web/fixtures/mugging-quotes';

export default class MuggingVictoryComponent extends Component {

  cutsHarvested;

  @computed('socket.stateData.player.weapon')
  get playerWeapon() {
    return storeItems[this.get('socket.stateData.player.weapon')].display;
  }

  @computed()
  randomVictoryQuote() {
    return victoryQuotes[Math.floor(Math.random() * Math.floor(victoryQuotes.length))];
  }

  @computed('cutsHarvested')
  get cutsList() {
    let cuts = this.get('cutsHarvested');

    if (!cuts.length) { return null;}

    if (cuts.length === 1) {
      return cuts[0];
    } else if (cuts.length === 2) {
      return `${cuts[0]} and ${cuts[1]}`;
    } else {
      cuts.map((el, i) => {
        if (i === cuts.length - 1) {
          return "and " + el;
        } else {
          return el;
        }
      }).join(", ");
    }
  }

}
