import Route from '@ember/routing/route';

export default class AllScoresRoute extends Route {

  beforeModel() {
    this._super(...arguments);

    if (this.get('socket.gameStatus') !== 'in_game') {
      this.replaceWith('home');
    }
  }

}
