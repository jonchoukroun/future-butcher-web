import Service    from '@ember/service'
import { Socket } from 'phoenix'
import { get, set }    from '@ember/object'
import ENV        from '../config/environment'

export default Service.extend({

  gameChannel: null,
  stateData:   null,
  gameStatus:  null,
  finalScore:  null,

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
        set(this, 'stateData', response.state_data);
        this._handleSuccess("Game ended successfully", response);
      })
      .receive("error", response => {
        this._handleFailure("Failed to end game", response);
      })

  },

  changeStation(station) {
    get(this, 'gameChannel').push("change_station", {"destination": station})
      .receive("ok", response => {
        set(this, 'stateData', response.state_data);
        this._handleSuccess("Station changed", response);
      })
      .receive("game_over", response => {
        this.retirePlayer(response.state_data);
      })
      .receive("error", response => {
        this._handleFailure("Failed to change station", response);
      })
  },

  buyCut(cut, amount) {
    get(this, 'gameChannel').push("buy_cut", { "cut": cut, "amount": amount })
      .receive("ok", response => {
        set(this, 'stateData', response.state_data);
        this._handleSuccess("Cut bought", response);
      })
      .receive("error", response => {
        this._handleFailure("Failed to buy cut", response);
      })
  },

  sellCut(cut, amount) {
    get(this, 'gameChannel').push("sell_cut", { "cut": cut, "amount": amount })
      .receive("ok", response => {
        set(this, 'stateData', response.state_data);
        this._handleSuccess("Cut sold", response);
      })
      .receive("error", response => {
        this._handleFailure("Failed to sell cut", response);
      })
  },

  payDebt(amount) {
    get(this, 'gameChannel').push("pay_debt", { "amount": amount })
      .receive("ok", response => {
        set(this, 'stateData', response.state_data);
        this._handleSuccess("Debt repaid", response);
      })
      .receive("error", response => {
        this._handleFailure("Failed to repay debt", response);
      })
  },

  retirePlayer(state) {
    let score = state.player.debt === 0 ? state.player.funds : null;
    if (score === 0) { score = null; }
    set(this, 'finalScore', score);
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
    console.error(message, response.reason); // eslint-disable-line
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
