import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { classNames } from '@ember-decorators/component';

@classNames('row d-flex flex-row justify-content-center align-items-center my-3')

export default class ShareRowComponent extends Component {

  @service('tracking-service') trackingService;

  url   = "https://www.futurebutcher.com";
  title = "Check out this awesome game";

  description = "You only have 24 hours to buy and sell human meat at market and earn enough cash to smuggle yourself out of LA to Mexico.";

  image_url = "https://s3-us-west-1.amazonaws.com/futurebutcher.com/assets/background-night.jpeg";

  @computed('userAgent.os.{isIOS,isAndroid}')
  get smsLink() {
    const message = encodeURIComponent(`${this.title} ${this.url}`);
    if (this.get('userAgent.os.isIOS')) {
      return "sms:&body=" + message;
    }

    if (this.get('userAgent.os.isAndroid')) {
      return "sms:?body=" + message;
    }
  }

  @action
  trackSMSShare() {
    this.get('trackingService').trackEvent('Shared via SMS');
  }
}
