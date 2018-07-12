import Component from '@ember/component'
import { computed, get } from '@ember/object'
import { htmlSafe } from '@ember/string'

export default Component.extend({

  classNames: ['card', 'accordion-card', 'bg-black'],

  cardId:    null,
  cardTitle: null,
  cardText:  null,

  parentId: computed('customId', function() {
    return htmlSafe(`#${get(this, 'customId')}`);
  }),

  bodyId: computed('cardId', function() {
    return htmlSafe(`#${get(this, 'cardId')}`);
  }),

  headerId: computed('cardId', function() {
    return htmlSafe(`${get(this, 'cardId')}-heading`);
  })

})
