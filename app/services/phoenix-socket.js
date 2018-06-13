import Service from '@ember/service'
import { Socket } from 'phoenix'
import { computed, get, set } from '@ember/object'
import RSVP from 'rsvp'
import ENV from '../config/environment'

export default Service.extend({

  gameChannel: null,
  stateData:   null,
  gameRestore: null,

  gameStatus: computed('stateData.rules.state', function(){
    return get(this, 'stateData.rules.state');
  }),

  connect(params) {
    let name = params.name;
    if (!name || name.length < 3) { return; }
    localStorage.setItem('player_name', name);

    let socket  = this._openSocket(ENV.api_url);
    let hash_id = params.hash_id;

    if (hash_id) {
      return this._reJoinChannel(socket, name, hash_id);
    } else {
      return this._joinChannel(socket, name);
    }
  },

  pushCallBack(callback, payload) {
    if (!this._validateCallback(callback)) { return this._handleFailure("Invalid callback", null); }

    return new RSVP.Promise((resolve, reject) => {
      get(this, 'gameChannel').push(callback, payload)
        .receive("ok", response => {
          this._handleSuccess("Success", response);
          resolve(response);
        })
        .receive("error", response => {
          this._handleFailure("Failure", response);
          reject(response);
        })
    });
  },

  restoreGameState(name) {
    return new RSVP.Promise((resolve, reject) => {
      get(this, 'gameChannel').push("restore_game_state", name)
        .receive("ok", response => {
          this._handleSuccess("Reconnected successfully", response)
          resolve(response);
        })
        .receive("error", response => {
          set(this, 'gameRestore', 'failed');
          this._handleFailure("Couldn't restore game state", response);
          reject(response);
        })
    })
  },

  getScores() {
    return new RSVP.Promise((resolve) => {
      get(this, 'gameChannel').push("get_scores").receive("ok", response => {
        set(this, 'orderedScores', response.state_data);
        resolve(response);
      });
    });
  },

  _joinChannel(socket, name) {
    let channel = socket.channel("game:" + name, { player_name: name });

    return new RSVP.Promise((resolve, reject) => {
      channel.join()
        .receive("ok", response => {
          localStorage.setItem('player_hash', response.hash_id);
          set(this, 'gameChannel', channel);
          this._handleSuccess("Connected successfully", response);
          resolve(response);
        })
        .receive("error", response => {
          this._handleFailure("Couldn't connect", response);
          reject(response);
        })
    })
  },

  _reJoinChannel(socket, name, hash_id) {
    let channel = socket.channel("game:" + name, { player_name: name, hash_id: hash_id });

    return new RSVP.Promise((resolve, reject) => {
      channel.join()
        .receive("ok", response => {
          set(this, 'gameChannel', channel);
          this._handleSuccess("Reconnected successfully", response);
          resolve(response);
        })
        .receive("error", response => {
          localStorage.setItem('player_name', null);
          localStorage.setItem('player_hash', null);
          this._handleFailure("Couldn't reconnect", response);
          reject(response);
        })
    })
  },

  _validateCallback(callback) {
    const validCallbacks = [
      "new_game", "start_game", "end_game", "change_station", "buy_cut", "sell_cut", "pay_debt"
    ];
    return validCallbacks.includes(callback);
  },

  _openSocket(url) {
    const socket = new Socket(url, {});
    socket.connect();
    return socket;
  },

  _handleSuccess(message, response) {
    message = message || "Success, no message";
    console.log(message, response); // eslint-disable-line
    set(this, 'stateData', response.state_data);
  },

  _handleFailure(message, response) {
    message    = message || "Failure, no message";
    let reason = (response || {}) || "";
    console.error(message, reason); // eslint-disable-line
  }

})
