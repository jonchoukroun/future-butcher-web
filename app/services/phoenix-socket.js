import Service    from '@ember/service'
import { Socket } from 'phoenix'
import { set }    from '@ember/object'
import ENV        from '../config/environment'

export default Service.extend({

  gameChannel: null,

  connect(params) {
    let name    = params.name;
    let hash_id = params.hash_id;
    let socket  = this._openSocket(ENV.api_url);

    localStorage.setItem('player_name', name);

    if (hash_id) {
      return this._reJoinChannel(socket, name, hash_id);
    } else {
      return this._joinChannel(socket, name, hash_id);
    }
  },

  _openSocket(url) {
    const socket = new Socket(url, {});
    socket.connect();
    return socket;
  },

  _joinChannel(socket, name) {
    let channel = socket.channel("game:" + name, { player_name: name });

    channel.join()
      .receive("ok", res => {
        localStorage.setItem('player_hash', res.hash_id);
        this._handleSuccess("Connected successfully", res);
      })
      .receive("error", res => {
        this._handleFailure("Couldn't connect", res);
      })

    set(this, 'gameChannel', channel);
  },

  _reJoinChannel(socket, name, hash_id) {
    let channel = socket.channel("game:" + name, { player_name: name, hash_id: hash_id });

    channel.join()
      .receive("ok", res => {
        localStorage.setItem('player_hash', res.hash_id);
        this._handleSuccess("Reconnected successfully", res)
      })
      .receive("error", res => {
        localStorage.setItem('player_name', null);
        localStorage.setItem('player_hash', null);
        this._handleFailure("Couldn't reconnect", res);
      })

    set(this, 'gameChannel', channel);
  },

  _handleSuccess(message, response) {
    console.log(message, response) // eslint-disable-line
  },

  _handleFailure(message, response) {
    console.error(message, response.reason); // eslint-disable-line
  }

})
