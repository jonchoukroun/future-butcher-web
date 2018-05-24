import Service    from '@ember/service'
import { Socket } from 'phoenix'
import { get, set }    from '@ember/object'
import ENV        from '../config/environment'

export default Service.extend({

  gameChannel: null,
  stateData:   null,
  highScores:  null,

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

  newGame() {
    get(this, 'gameChannel').push("new_game")
      .receive("ok", response => {
        this._handleSuccess("New game created", response);
      })
      .receive("error", response => {
        this._handleFailure("Failed to create new game", response);
      })
  },

  startGame() {
    get(this, 'gameChannel').push("start_game")
      .receive("ok", response => {
        set(this, 'stateData', response.state_data);
        this._handleSuccess("Game started successfully", response);
      })
      .receive("error", response => {
        this._handleFailure("Failed to start game", response);
      })
  },

  endGame(score) {
    let payload = { score: score, hash_id: localStorage.getItem('player_hash') };
    get(this, 'gameChannel').push("end_game", payload)
      .receive("ok", response => {
        set(this, 'highScores', response.state_data);
        this._handleSuccess("Game ended successfully", response);
      })
      .receive("error", response => {
        this._handleFailure("Failed to end game", response);
      })

  },

  // changeStation(station) {
  //   get(this, 'gameChannel').push("change_station", {"destination": station})
  //     .receive("ok", response => {
  //       set(this, 'stateData', response.state_data);
  //       this._handleSuccess("Station changed", response);
  //     })
  //     .receive("game_over", response => {
  //       this._retirePlayer();
  //     })
  //     .receive("error", response => {
  //       this._handleFailure("Failed to change station", response);
  //     })
  // },

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
      .receive("ok", response => {
        localStorage.setItem('player_hash', response.hash_id);
        this._handleSuccess("Reconnected successfully", response)
      })
      .receive("error", response => {
        localStorage.setItem('player_name', null);
        localStorage.setItem('player_hash', null);
        this._handleFailure("Couldn't reconnect", response);
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
