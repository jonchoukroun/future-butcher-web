import Component from '@ember/component'
import { get } from '@ember/object'

export default Component.extend({

  actions: {

    startGame() {
      get(this, 'socket').pushCallBack("new_game", {});
      get(this, 'socket').pushCallBack("start_game", {});
    }

  }

})
