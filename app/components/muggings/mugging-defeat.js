import Component from '@ember/component';
import { computed } from '@ember-decorators/object';

import { defeatQuotes, defeatedButtonText } from 'future-butcher-web/fixtures/mugging-quotes';

export default class MuggingDefeatComponent extends Component {

  @computed()
  randomDefeatQuote() {
    return defeatQuotes[Math.floor(Math.random() * Math.floor(defeatQuotes.length))];
  }

  @computed()
  randomDefeatedButton() {
    return defeatedButtonText[Math.floor(Math.random() * Math.floor(defeatedButtonText.length))];
  }

}
