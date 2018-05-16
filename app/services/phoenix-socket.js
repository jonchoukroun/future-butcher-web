import Service      from '@ember/service'
import { Socket }   from 'phoenix'
import { set } from '@ember/object'
import ENV          from '../config/environment'

export default Service.extend({

  connect(params) {
    let name    = params.name;
    let socket  = this._openSocket(ENV.api_url);

    localStorage.setItem('player_name', name);

    return this._joinChannel(socket, name);
  },

  _openSocket(url) {
    const params = {token: "heyNongMan"}
    const socket = new Socket(url, { params: params });
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
    console.log(message, response) // eslint-disable-line
  },

  _handleFailure(message, response) {
    console.error(message, response.reason); // eslint-disable-line
  }

})
