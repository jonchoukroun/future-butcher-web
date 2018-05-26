import Component from '@ember/component'
import { get } from '@ember/object'

export default Component.extend({

  tagName: 'button',

  classNames: ['btn', 'btn-primary', 'btn-lg'],

  click() {
    let payload = { amount: get(this, 'socket.stateData.player.debt') };
    get(this, 'socket').pushCallBack("pay_debt", payload);
  }

})
