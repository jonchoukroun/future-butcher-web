import Controller from '@ember/controller';
import { set } from '@ember/object';

export default Controller.extend({

  channelJoined: false,

  actions: {

    hasJoinedChannel() {
      set(this, 'channelJoined', true);
      return false;
    }

  }

})
