import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('home', { path: '/' });

  this.route('create-player');

  this.route('market');

  this.route('subway');
  this.route('traveling');
  this.route('mugging');

  this.route('bank');

  this.route('store');

  this.route('high-scores');

  this.route('all-scores');

  this.route('unavailable');

  this.route('catch-all', { path: '*'});

});

export default Router;
