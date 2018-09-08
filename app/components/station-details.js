import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({

  actions: {
    selectStation() {
      get(this, 'selectStation')(get(this, 'station.name'));
    }
  }

});
