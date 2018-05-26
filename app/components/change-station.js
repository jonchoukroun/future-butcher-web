import Component from '@ember/component'
import { get } from '@ember/object'

export default Component.extend({

  tagName: 'button',

  classNames: ['btn', 'btn-primary', 'btn-lg'],

  click() {
    get(this, 'socket').pushCallBack("change_station", { destination: "koreatown" });
  }

})
