import Component from '@ember/component'
import { set }   from '@ember/object'

export default Component.extend({

  collapsed: true,

  _incrementExpandedStatus() {
    status = localStorage.getItem('expanded_inventory');
    if (parseInt(status) > 0) {
      console.log('true')
      localStorage.setItem('expanded_inventory', ++status);
    } else {
      localStorage.setItem('expanded_inventory', 1);
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
