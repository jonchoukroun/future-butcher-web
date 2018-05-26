export function initialize(application) {

  /*eslint no-unused-vars: ["error", { "args": "none" }]*/
  ['route', 'component', 'controller'].forEach((factory, index) => {
    application.inject(factory, 'session', 'service:session');
  });

}

export default {
  initialize
};
