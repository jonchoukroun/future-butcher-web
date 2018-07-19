import Component from '@ember/component'
import { get, observer, set } from '@ember/object'
import { later } from '@ember/runloop'

export default Component.extend({

  message: null,

  visibility: 'collapse',

  hasMessage: observer('message', function() {
    if (get(this, 'message')) {
      set(this, 'visibility', 'show');
      later(() => {
        set(this, 'visibility', 'collapse');
        set(this, 'message', null);
      }, 1500);
    }
  }),

  elementId: 'transaction-alert',

  classNames: ['alert', 'alert-success', 'alert-dismissable', 'fade', 'my-2'],

  classNameBindings: ['visibility'],

  attributeBindings: ['role'],
  role: 'alert',

})
