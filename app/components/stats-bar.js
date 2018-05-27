import Component from '@ember/component'
import { set }   from '@ember/object'

export default Component.extend({

  collapsed: true,

  actions: {

    showExpandedStats() {
      set(this, 'collapsed', false);
    },

    showCollapsedStats() {
      set(this, 'collapsed', true);
    }

  }

})
