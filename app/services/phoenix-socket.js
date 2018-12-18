import Service from '@ember/service'
import { inject as service } from '@ember/service'
import { Socket } from 'phoenix'
import { computed, get, set } from '@ember/object'
import RSVP from 'rsvp'
import ENV from '../config/environment'

export default Service.extend({

  router: service(),
  raven: service(),

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
        this.get('router').replaceWith('unavailable');
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
          const user_id = response.hash_id;
          localStorage.setItem('player_hash', user_id);
          this.set('gameChannel', channel);

          analytics.identify(user_id, { player_name: name })
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

    if (ENV.environment === 'production') {
      analytics.track(callback);
    }

    return new RSVP.Promise((resolve, reject) => {
      this.get('gameChannel').push(callback, payload)
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
      this.get('gameChannel').push("restore_game_state", name)
        .receive("ok", response => {
          this.set('gameRestoreSuccess', true);

          const msg = "Reconnected successfully";
          this._handleSuccess(msg, response);

          resolve(response);
        })
        .receive("error", response => {
          this.set('gameRestoreSuccess', false);
          this._handleFailure("Couldn't restore game state", response);
          reject(response);
        })
    })
  },

  getScores() {
    return new RSVP.Promise((resolve) => {
      this.get('gameChannel').push("get_scores").receive("ok", response => {
        const msg = "Scores retrieved";
        this._handleSuccess(msg, response);

        resolve(response);
      });
    });
  },

  _validateCallback(callback) {
    const validCallbacks = [
      "new_game", "start_game", "end_game", "change_station", "buy_cut", "sell_cut", "pay_debt", "buy_loan", "fight_mugger", "bribe_mugger", "buy_weapon", "drop_weapon", "replace_weapon", "buy_pack"
    ];
    return validCallbacks.includes(callback);
  },

  _handleSuccess(message, response) {
    this.set('stateData', response.state_data);
    if (ENV.environment === 'production') { return; }

    message = message || "Success, no message";
    console.log(message, response); // eslint-disable-line
  },

  _handleFailure(message, response) {
    message = message || "Failure, no message";
    const reason = response["reason"];
    const error_message = (reason ? reason : "No additional info");

    if (ENV.environment === 'production') {
      this.get('raven').captureMessage(`${message}: ${error_message}`)
    } else {
      console.error(message, error_message); // eslint-disable-line
    }
  }

})
