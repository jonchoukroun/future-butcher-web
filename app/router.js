import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('home', { path: '/' });

  this.route('game');

  this.route('help');

  this.route('create-player');

  this.route('bank');

  this.route('market');

  this.route('subway');

});

export default Router;
