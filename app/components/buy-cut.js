import Component from '@ember/component'
import { get } from '@ember/object'

export default Component.extend({

  tagName: 'button',

  classNames: ['btn', 'btn-primary', 'btn-lg'],

  click() {
    let payload = { cut: "loin", amount: 2 };
    get(this, 'socket').pushCallBack("buy_cut", payload);
  }

})
