import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { classNames } from '@ember-decorators/component';
import ENV from 'future-butcher-web/config/environment';

@classNames('row d-flex flex-row justify-content-center align-items-center my-1')

export default class ShareRowComponent extends Component {

  @service('tracking-service') trackingService;

  url   = "https://www.futurebutcher.com";
  title = "Check out this awesome game";

  description = "You only have 24 hours to buy and sell human meat at market and earn enough cash to smuggle yourself out of LA to Mexico.";

  image_url = `${ENV.ASSETS_S3_BUCKET}/background-night.jpeg`;

  @computed('userAgent.os.{isIOS,isAndroid}')
  get smsLink() {
    const message = encodeURIComponent(`${this.title} ${this.url}`);
    if (this.get('userAgent.os.isIOS')) {
      return "sms:&body=" + message;
    }

    return "sms:?body=" + message;
  }

  @action
  shareSMS() {
    window.location.replace(this.get('smsLink'));
    this.trackMsgShare('SMS');
  }

  @action
  shareEmail() {
    window.location.replace(`mailto:?subject=${this.title}&body=${this.url}`);
    this.trackMsgShare('email');
  }

  trackMsgShare(medium) {
    this.get('trackingService').trackEvent(`Shared via ${medium}`);
  }
}
