import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { defeatedButtonText } from 'future-butcher-web/fixtures/mugging-quotes';

export default Component.extend({

  cutsLost: null,

  cutLostName: computed('cutsLost', function() {
    return Object.keys(get(this, 'cutsLost'))[0];
  }),

  cutLostAmount: computed('cutsLost', 'cutLostName', function() {
    return get(this, 'cutsLost')[get(this, 'cutLostName')];
  }),

  randomDefeatedButton: computed(function() {
    return defeatedButtonText[Math.floor(Math.random() * Math.floor(defeatedButtonText.length))];
  })

});
