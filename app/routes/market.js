import Route from '@ember/routing/route';

export default class MarketRoute extends Route {

  beforeModel() {
    this.handleRouteRedirect();
  }

  handleRouteRedirect() {
    let state = this.get('socket.gameStatus');

    if (state === 'mugging') {
      this.replaceWith('mugging');
    } else if (state !== 'in_game') {
      this.replaceWith('home');
    } else {
      return;
    }
  }

}
