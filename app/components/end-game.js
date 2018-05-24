import Component from '@ember/component'
import { get } from '@ember/object'

export default Component.extend({

  tagName: 'button',

  classNames: ['btn', 'btn-primary', 'btn-lg'],

  click() {
    let payload = { score: 100, hash_id: localStorage.getItem('player_hash') };
    get(this, 'socket').pushCallBack("end_game", payload);
  }

})
