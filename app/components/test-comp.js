import Component  from '@ember/component'
import { get, set }    from '@ember/object'
import { inject } from '@ember/service'

export default Component.extend({

  phoenixSocket: inject('phoenix-socket'),

  actions: {

    connect() {
      let options = { name: "jon" };
      get(this, 'phoenixSocket').connect(options);
    }
  }

})
