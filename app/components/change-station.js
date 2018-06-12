import Component from '@ember/component'
import { get } from '@ember/object'

export default Component.extend({

  tagName: 'button',

  classNames: ['btn', 'btn-primary', 'btn-lg'],

  click() {
    let payload = { destination: "koreatown" };
    get(this, 'socket').pushCallBack("change_station", payload);
  }

})
