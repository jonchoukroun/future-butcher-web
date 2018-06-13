import Component from '@ember/component'
import { set }   from '@ember/object'

export default Component.extend({

  classNames: ['border-bottom', 'border-secondary'],

  collapsed: true,

  _incrementExpandedStatus() {
    let status = localStorage.getItem('stats_expanded_count');
    if (parseInt(status) > 0) {
      localStorage.setItem('stats_expanded_count', ++status);
    } else {
      localStorage.setItem('stats_expanded_count', 1);
    }
  },

  actions: {

    showExpandedStats() {
      set(this, 'collapsed', false);
      this._incrementExpandedStatus();
    },

    showCollapsedStats() {
      set(this, 'collapsed', true);
    }

  }

})
