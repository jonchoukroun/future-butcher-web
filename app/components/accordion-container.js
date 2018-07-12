import Component from '@ember/component'

export default Component.extend({

  classNames: ['accordion'],

  attributeBindings: ['customId:id'],

  customId: null

})
