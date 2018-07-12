import Route from '@ember/routing/route'
import { get } from '@ember/object'

export default Route.extend({

  beforeModel() {
    this._super(...arguments);

    if (!get(this, 'socket.gameChannel')) {
      this.replaceWith('home');
    }
  },

  // model() {
  //   const socketService = get(this, 'socket');
  //   if (get(socketService, 'gameChannel')) { return; }
  //
  //   const payload = {
  //     name: localStorage.getItem('player_name'),
  //     hash_id: localStorage.getItem('player_hash')
  //   };
  //
  //   if (get(socketService, 'gameChannel')) { return; }
  //
  //   socketService.openSocket().then((socket) => {
  //     socketService.joinChannel(socket, payload);
  //   }) ;
  // },


})
