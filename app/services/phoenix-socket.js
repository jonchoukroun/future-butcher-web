import Service      from '@ember/service'
import { Socket }   from 'phoenix'
import { get, set } from '@ember/object'
import ENV          from '../config/environment'

export default Service.extend({

  gameChannel() {
    get(this, 'gameChannel')
  },

  connect(params) {
    let name   = params.name;
    let socket = this.openSocket(ENV.api_url);

    set(this, 'gameChannel', this.joinChannel(socket, name));

    localStorage.setItem('current_player', name);
  },

  openSocket(url) {
    const socket = new Socket(url, {});
    socket.connect();
    return socket;
  },

  joinChannel(socket, name) {
    let channel = socket.channel("game:" + name, {
      screen_name: name,
      player_hash: this._getPlayerHash(name)
    });

    channel.join()
      .receive("ok", res => {
        console.log("Connected!", res);
      })
      .receive("error", res => {
        this._handleFailure("Couldn't connect", res);
      })
  },

  _getPlayerHash(name) {
    return `${name}_some2399sbdf`;
  },

  _handleFailure(message, response) {
    console.error(message, response.reason);
  }

})
