import Service      from '@ember/service'
import { Socket }   from 'phoenix'
import { get, set } from '@ember/object'
import ENV          from '../config/environment'

export default Service.extend({

  connect(params) {
    let name    = params.name;
    let socket  = this._openSocket(ENV.api_url);
    let channel = this._joinChannel(socket, name);

    localStorage.setItem('current_player', name);

    return channel;
  },

  _openSocket(url) {
    const socket = new Socket(url, {});
    socket.connect();
    return socket;
  },

  _joinChannel(socket, name) {
    let channel = socket.channel("game:" + name, { screen_name: name });

    channel.join()
      .receive("ok", res => {
        this._handleSuccess("Connected successfully", res)
      })
      .receive("error", res => {
        this._handleFailure("Couldn't connect", res);
      })

    set(this, 'gameChannel', channel);
  },

  _handleSuccess(message, response) {
    console.log(message, response)
  },

  _handleFailure(message, response) {
    console.error(message, response.reason);
  }

})
