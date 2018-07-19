import Component from '@ember/component'
import { computed, get, set } from '@ember/object'

export default Component.extend({

  debt: null,
  rate: null,

  isDisabled: false,
  isSelected: false,

  classNames: ['row', 'align-items-center', 'justify-content-around', 'px-3'],

  classNameBindings: ['isDisabled:disabled-loan'],

  displayedRate: computed('rate', function() {
    return get(this, 'rate') * 100;
  }),

  actions: {

    selectLoan() {
      set(this, 'isSelected', true);
      get(this, 'sendLoanSelect')(get(this, 'debt'), get(this, 'rate'));
    },

    deSelectLoan() {
      set(this, 'isSelected', false);
      get(this, 'sendLoanSelect')(null);
    }
  }

})
