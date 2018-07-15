import Component from '@ember/component'
import { computed, get }   from '@ember/object'

export default Component.extend({

  elementId: 'stats-bar',

  classNames: ['border-bottom', 'border-secondary'],

  stateData: computed('socket.stateData', function() {
    return get(this, 'socket.stateData');
  }),

  playerFunds: computed('stateData', function() {
    return get(this, 'stateData.player.funds');
  }),

  playerDebt: computed('stateData', function() {
    return get(this, 'stateData.player.debt');
  }),

  turnsLeft: computed('stateData.rules.turns_left', function() {
    return get(this, 'stateData.rules.turns_left');
  }),

  actions: {

    payDebt() {
      let payload = { amount: get(this, 'playerDebt') };
      get(this, 'socket').pushCallBack("pay_debt", payload);
    }

  }

})
