import Route from '@ember/routing/route'

export default class CreatePlayerRoute extends Route {

  beforeModel() {
    if (this.get('socket.gameChannel')) {
      this.replaceWith('home');
    }

    localStorage.removeItem('player_name');
    localStorage.removeItem('player_hash');
  }

}
