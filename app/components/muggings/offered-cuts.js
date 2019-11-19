import Component from '@ember/component';
import { computed } from '@ember/object';

import { defeatedButtonText } from 'future-butcher-web/fixtures/mugging-quotes';

export default class OfferedCutsComponent extends Component {

  cutLost = this.cutLost !== undefined ? this.cutLost : null;
  muggerName = this.muggerName !== undefined ? this.muggerName : null;

  @computed('cutLost')
  get cutName() {
    return Object.keys(this.cutLost)[0];
  }

  @computed('cutLost', 'cutName')
  get lossAmount() {
    return this.cutLost[this.cutName];
  }

  @computed()
  get randomDefeatedButton() {
    return defeatedButtonText[Math.floor(Math.random() * Math.floor(defeatedButtonText.length))];
  }
}
