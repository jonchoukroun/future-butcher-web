import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class ResetTutorialsComponent extends Component {

  isEnabled = false;

  didReceiveAttrs() {
    this._super(...arguments);

    const debtTutorial = localStorage.getItem('closed-debt-tutorial');
    const fundsTutorial = localStorage.getItem('closed-funds-tutorial');
    const navigationTutorial = localStorage.getItem('closed-navigation-tutorial');

    if (debtTutorial || fundsTutorial || navigationTutorial) {
      this.set('hasClosedTutorials', true);
    }
  }

  @action
  toggleTutorials() {
    if (this.isEnabled) {
      this.set('isEnabled', false);
    } else {
      this.set('isEnabled', true);
    }

    this.sendTutorialSelection(this.isEnabled);
  }

}
