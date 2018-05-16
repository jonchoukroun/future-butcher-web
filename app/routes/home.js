import Route   from '@ember/routing/route'
import { get } from '@ember/object'

export default Route.extend({

  setupController(controller) {
    this._super(...arguments);

    let name = localStorage.getItem('player_name');

    if (name && name.length > 2) {
      get(this, 'socket').connect({ name: name });
      controller.set('channelJoined', true);
    }

  }
})
