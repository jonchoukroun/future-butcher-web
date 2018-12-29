import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { classNames } from '@ember-decorators/component';

@classNames('signup-component')
export default class SignupFormComponent extends Component {

  inputLength = null;
  validInput  = false;
  isNameTaken = false;

  @service('tracking-service') trackingService;

  @computed('inputLength')
  get invalidButtonText() {
    const inputLength = this.get('inputLength');

    if (inputLength === 1) {
      return "Needs more letters...";
    } else if (inputLength === 2) {
      return "Almost there...";
    } else {
      return null;
    }
  }

  evaluateNewCharInput() {
    if (this.get('isNameTaken')) {
      if (this.get('playerName').length === 0) { this.set('isNameTaken', false); }
    }

    this.set('inputLength', this.get('playerName').length);
  }

  @action
  validatePlayerName() {
    this.evaluateNewCharInput();

    if (this.get('playerName').trim().length >= 3) {
      this.set('validInput', true);
    } else {
      this.set('validInput', false);
    }
  }

  @action
  createPlayer() {
    const socketService = this.get('socket');
    const name = this.get('playerName');

    if (!name || name.length < 3) { return; }

    socketService.openSocket().then((socket) => {
      socketService.joinChannel(socket, { name: name }).then(() => {
        this.set('isNameTaken', false);
        this.get('trackingService').trackEvent('Created player');
        this.get('sendJoin')();
      }).catch(() => {
        this.set('isNameTaken', true);
      })
    })
  }

  didInsertElement() {
    super.didInsertElement();
    this.$('#player-name').focus();
  }

}
