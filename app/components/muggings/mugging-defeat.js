import Component from '@ember/component';
import { computed } from '@ember/object';
import { defeatQuotes, defeatedButtonText } from 'future-butcher-web/fixtures/mugging-quotes';

export default Component.extend({

  randomDefeatQuote: computed(function() {
    return defeatQuotes[Math.floor(Math.random() * Math.floor(defeatQuotes.length))];
  }),

  randomDefeatedButton: computed(function() {
    return defeatedButtonText[Math.floor(Math.random() * Math.floor(defeatedButtonText.length))];
  })

});
