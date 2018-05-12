import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { get, set, computed } from '@ember/object';

export default Controller.extend({

  phoenixSocket: service('phoenix-socket'),

  channelJoined: false,

  actions: {

    hasJoinedChannel() {
      set(this, 'channelJoined', true);
      return false;
    }

  }

})
