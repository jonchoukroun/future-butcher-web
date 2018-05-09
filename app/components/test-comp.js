import Component from '@ember/component'
import { Socket } from 'phoenix'

export default Component.extend({

  didReceiveAttrs() {
    this._super(...arguments);

    let socket = new Socket('ws://localhost:4000/socket', {});
    socket.connect();

    let channel = socket.channel("game:jon", {
      screen_name: "jon",
      player_hash: "sdf09sjdf"
    });

    channel.join()
      .receive("ok", response => {
        console.log("Connected successfully", response);
      })
      .receive("error", response => {
        console.error("Fucked up", response);
      })
  },

})
