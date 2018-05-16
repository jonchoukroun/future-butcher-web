export function initialize(application) {

  /*eslint no-unused-vars: ["error", { "args": "none" }]*/
  ['route', 'component', 'controller'].forEach((factory, idx) => {
    application.inject(factory, 'socket', 'service:phoenix-socket');
  });

}

export default {
  initialize
};
