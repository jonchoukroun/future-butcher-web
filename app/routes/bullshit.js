import Route from '@ember/routing/route'
import { get } from '@ember/object'

export default Route.extend({

  model() {
    const socketService = get(this, 'socket');
    if (get(socketService, 'gameChannel')) { return; }

    const payload = {
      name: "jon",
      hash_id: "s9sk2k2-f"
    };

    if (get(socketService, 'gameChannel')) { return; }

    socketService.openSocket().then((socket) => {
      socketService.joinChannel(socket, payload);
    }) ;
  }

})
