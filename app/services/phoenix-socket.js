import Service    from '@ember/service'
import { Socket } from 'phoenix'
import { get, set }    from '@ember/object'
import ENV        from '../config/environment'

export default Service.extend({

  gameChannel: null,
  stateData:   null,
  gameStatus:  null,

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
    if (!this._validateCallback(callback)) {
      return this._handleFailure("Invalid callback", null);
    }

    get(this, 'gameChannel').push(callback, payload)
      .receive("ok", response => {
        set(this, 'stateData', response.state_data);
        this._handleSuccess("Success", response);
      })
      .receive("game_over", response => {
        set(this, 'stateData', response);
        this._handleSuccess("Success", response);
      })
      .receive("error", response => {
        this._handleFailure("Failed", response);
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

  _joinChannel(socket, name) {
    let channel = socket.channel("game:" + name, { player_name: name });

    channel.join()
      .receive("ok", response => {
        localStorage.setItem('player_hash', response.hash_id);
        this._handleSuccess("Connected successfully", response);
      })
      .receive("error", response => {
        this._handleFailure("Couldn't connect", response);
      })

    set(this, 'gameChannel', channel);
  },

  _reJoinChannel(socket, name, hash_id) {
    let channel = socket.channel("game:" + name, { player_name: name, hash_id: hash_id });

    channel.join()
      .receive("ok", () => {
        this._restoreGameState(name);
      })
      .receive("error", response => {
        localStorage.setItem('player_name', null);
        localStorage.setItem('player_hash', null);
        this._handleFailure("Couldn't reconnect", response);
      })

    set(this, 'gameChannel', channel);
  },

  _restoreGameState(name) {
    get(this, 'gameChannel').push("restore_game_state", name)
      .receive("ok", response => {
        set(this, 'stateData', response.state_data);
        this._handleSuccess("Reconnected successfully", response)
      })
      .receive("error", response => {
        this._handleFailure("Couldn't restore game state", response);
      })
  },

  _handleSuccess(message, response) {
    this._setGameStatus();
    console.log(message, response); // eslint-disable-line
  },

  _handleFailure(message, response) {
    let reason = (response || {}).reason || "";
    console.error(message, reason); // eslint-disable-line
  },

  _setGameStatus() {
    let status = get(this, 'stateData.rules.state');

    if (!status || status === 'game_over') {
      set(this, 'gameStatus', null);
    } else {
      set(this, 'gameStatus', status);
    }
  }

})
