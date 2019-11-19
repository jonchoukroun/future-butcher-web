import Route from '@ember/routing/route';

export default class SubwayRoute extends Route {

  beforeModel() {
    if (this.get('socket.gameStatus') !== 'in_game') {
      this.replaceWith('home');
    }
  }

}
