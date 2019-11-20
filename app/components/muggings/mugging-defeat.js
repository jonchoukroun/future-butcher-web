import Component from '@ember/component';
import { computed } from '@ember/object';

import { defeatQuotes, defeatedButtonText } from 'future-butcher-web/fixtures/mugging-quotes';

export default class MuggingDefeatComponent extends Component {

  @computed()
  get randomDefeatQuote() {
    return defeatQuotes[Math.floor(Math.random() * Math.floor(defeatQuotes.length))];
  }

  @computed()
  get randomDefeatedButton() {
    return defeatedButtonText[Math.floor(Math.random() * Math.floor(defeatedButtonText.length))];
  }

}
