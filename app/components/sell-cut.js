import Component from '@ember/component'
import { get } from '@ember/object'

export default Component.extend({

  tagName: 'button',

  classNames: ['btn', 'btn-primary', 'btn-lg'],

  click() {
    let payload = { cut: "loin", amount: 1 };
    get(this, 'socket').pushCallBack("sell_cut", payload);
  }

})
