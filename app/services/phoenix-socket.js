import PhoenixSocket from 'phoenix/services/phoenix-socket';

export default PhoenixSocket.extend({

  init() {
    this.on('open', () => {
      console.log('Socket opened');
    })
  },

  connect(/*url, options*/) {
    this._super("wss://localhost.com/socket/");
    const channel = this.joinChannel("game:jon", {
      screen_name: "jon",
      player_hash: "s89sdf23or"
    });

    channel.on("ok", () => { console.log("connected") })
  }
})
