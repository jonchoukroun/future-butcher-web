import Service from '@ember/service'
import { inject as service } from '@ember/service'
import { Socket } from 'phoenix'
import { computed, get, set } from '@ember/object'
import RSVP from 'rsvp'
import ENV from '../config/environment'

export default Service.extend({

  router: service(),

  gameStatus: computed('stateData.rules.state', function(){
    return get(this, 'stateData.rules.state');
  }),

  openSocket() {
    const socket = new Socket(ENV.api_url, {});
    return new RSVP.Promise((resolve, reject) => {
      socket.connect();
      socket.onOpen(() => {
        this._handleSuccess("Socket opened successfully", {});
        resolve(socket);
      });
      socket.onError(() => {
        this._handleFailure("Failed to open socket", {});
        reject(socket);
        get(this, 'router').replaceWith('unavailable');
      });
    });
  },

  joinChannel(socket, params) {
    let name    = params.name;
    let hash_id = params.hash_id;

    localStorage.setItem('player_name', name);

    const payload = { player_name: name };
    if (hash_id) { payload.player_hash = hash_id }

    let channel = socket.channel("game:" + name, payload);
    return new RSVP.Promise((resolve, reject) => {
      channel.join()
        .receive("ok", response => {
          localStorage.setItem('player_hash', response.hash_id);
          set(this, 'gameChannel', channel);
          this._handleSuccess("Joined successfully", response);
          resolve(response);
        })
        .receive("error", reason => {
          this._handleFailure("Failed to join", reason);
          reject(reason);
        })
    })
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
          set(this, 'gameRestoreSuccess', true);
          this._handleSuccess("Reconnected successfully", response)
          resolve(response);
        })
        .receive("error", response => {
          set(this, 'gameRestoreSuccess', false);
          this._handleFailure("Couldn't restore game state", response);
          reject(response);
        })
    })
  },

  getScores() {
    return new RSVP.Promise((resolve) => {
      get(this, 'gameChannel').push("get_scores").receive("ok", response => {
        this._handleSuccess("Scores retrieved", response);
        resolve(response);
      });
    });
  },

  _validateCallback(callback) {
    const validCallbacks = [
      "new_game", "start_game", "end_game", "change_station", "buy_cut", "sell_cut", "pay_debt"
    ];
    return validCallbacks.includes(callback);
  },

  _handleSuccess(message, response) {
    if (ENV.environment === 'production') { return; }
    message = message || "Success, no message";
    console.log(message, response); // eslint-disable-line
    set(this, 'stateData', response.state_data);
  },

  _handleFailure(message, response) {
    if (ENV.environment === 'production') { return; }
    message    = message || "Failure, no message";
    let reason = (response || {}) || "";
    console.error(message, reason); // eslint-disable-line
  }

})
