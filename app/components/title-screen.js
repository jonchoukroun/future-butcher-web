import Component from '@ember/component';
import { later } from '@ember/runloop';

export default class TitleScreenComponent extends Component {

  didInsertElement() {
    super.didInsertElement();

    later(() => {
      this.animateHeartBeat();
    }, 700);

    later(() => {
      this.animateMacheteSlash()
    }, 2500);

    later(() => {
      this.animateSplatter();
    }, 3600);

    later(() => {
      this.revealTitle();
    }, 3300);
  }

  animateHeartBeat() {
    let sprite = document.getElementById('heart-sprite');
    sprite.style.transform = 'scaleX(1.3) scaleY(0.9)';

    later(() => {
      sprite.style.transform = 'scaleX(1) scaleY(1)';

      later(() => {
        this.animateHeartBeat();

        later(() => {
          sprite.style.display = 'none';
        }, 2080);
      }, 700);
    }, 170);
  }

  animateMacheteSlash() {
    let sprite = document.getElementById('machete-sprite');
    sprite.style.display = 'block';

    const offsetYLimit = this.get('element').offsetTop;
    let offsetX = sprite.offsetWidth / 2;
    let offsetY = sprite.offsetHeight;
    let rotate = 'rotate(45deg)';

    this.transformMachete(sprite, offsetX, offsetY, rotate);

    later(() => {
      for (var i = offsetY; i >= offsetYLimit; i--) {
        this.transformMachete(sprite, offsetX, i, rotate);

        if (i === offsetYLimit) {
          offsetY = i;
        }
      }

      later(() => {
        rotate = 'rotate(70deg)';
        this.transformMachete(sprite, offsetX, offsetY, rotate);

        for (var i = 70; i >= -30; i--) {
          rotate = `rotate(${i}deg)`;
          later(() => {
            this.transformMachete(sprite, offsetX, offsetY, rotate);

            later(() => {
              this.transformMachete(sprite, offsetX - 30, offsetY + 300, rotate);
              sprite.style.display = 'none';
            }, 30)
          }, 120);
        }
      }, 800);

    }, 200);
  }

  animateSplatter() {
    let sprite = document.getElementById('splatter-sprite');
    sprite.style.display = 'block';
  }

  revealTitle() {
    let sprite = document.getElementById('title-image');
    sprite.style.display = 'block';
  }

  transformMachete(sprite, offsetX, offsetY, rotate) {
    let transformOpts = new Array;
    let translate = `translate(${offsetX}px, ${offsetY}px)`;
    transformOpts.push(translate, rotate);
    sprite.style.transform = transformOpts.join(' ');
  }
}
