import Route from '@ember/routing/route';

export default class HighScoresRoute extends Route {

  beforeModel() {
    if (!this.get('socket.gameChannel')) {
      this.replaceWith('home');
    }
  }

}
