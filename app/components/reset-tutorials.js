import Component from '@ember/component'
import { get, set } from '@ember/object'

export default Component.extend({

  isEnabled: false,

  didReceiveAttrs() {
    this._super(...arguments);

    const debtTutorial = localStorage.getItem('closed-debt-tutorial');
    const fundsTutorial = localStorage.getItem('closed-funds-tutorial');
    const turnsTutorial = localStorage.getItem('closed-turns-tutorial');

    if (debtTutorial || fundsTutorial || turnsTutorial) {
      set(this, 'hasClosedTutorials', true);
    }
  },

  actions: {

    toggleTutorials() {
      if (this.isEnabled) {
        set(this, 'isEnabled', false);
      } else {
        set(this, 'isEnabled', true);
      }

      this.sendTutorialSelection(this.isEnabled);
    }

  }

})
