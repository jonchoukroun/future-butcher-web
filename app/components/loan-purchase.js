import Component from '@ember/component'
import { computed, get, set } from '@ember/object'

export default Component.extend({

  principle: null,
  interest:  null,

  isDisabled: false,
  isSelected: false,

  classNames: ['row', 'align-items-center', 'justify-content-around', 'px-3'],

  classNameBindings: ['isDisabled:disabled-loan'],

  displayedInterest: computed('interest', function() {
    return get(this, 'interest') * 100;
  }),

  actions: {

    selectLoan() {
      set(this, 'isSelected', true);
      get(this, 'sendLoanSelect')(get(this, 'principle'), get(this, 'interest'));
    },

    deSelectLoan() {
      set(this, 'isSelected', false);
      get(this, 'sendLoanSelect')(null);
    }
  }

})
