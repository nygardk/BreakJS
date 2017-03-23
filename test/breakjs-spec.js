import breakjs from '../src/break';


let layout = breakjs({
  mobile: 0,
  phablet: 550,
  tablet: 768,
  desktop: 992
});

function getViewPortWidth() {
  return window.innerWidth;
}

describe('BreakJS', () => {
  if (getViewPortWidth() < 550) {
    describe('on mobile browser', () => {
      it('is("mobile") should return true', () => {
        expect(layout.is('mobile')).toBeTruthy();
      });

      it('is("tablet") should return false', () => {
        expect(layout.is('tablet')).toBeFalsy();
      });

      it('atLeast("mobile") should return true', () => {
        expect(layout.atLeast('mobile')).toBeTruthy();
      });

      it('atMost("mobile") should return true', () => {
        expect(layout.atMost('mobile')).toBeTruthy();
      });

      it('atMost("tablet") should return true', () => {
        expect(layout.atMost('tablet')).toBeTruthy();
      });

      it('lessThan("mobile") should return false', () => {
        expect(layout.lessThan('mobile')).toBeFalsy();
      });

      it('lessThan("phablet") should return true', () => {
        expect(layout.lessThan('phablet')).toBeTruthy();
      });
    });
  }

  if (getViewPortWidth() >= 550 && getViewPortWidth() < 768) {
    describe('on phablet browser', () => {
      it('is("phablet") should return true', () => {
        expect(layout.is('phablet')).toBeTruthy();
      });

      it('is("mobile") should return false', () => {
        expect(layout.is('mobile')).toBeFalsy();
      });

      it('atLeast("tablet") should return false', () => {
        expect(layout.atLeast('tablet')).toBeFalsy();
      });

      it('atMost("mobile") should return false', () => {
        expect(layout.atMost('mobile')).toBeFalsy();
      });

      it('atMost("phablet") should return true', () => {
        expect(layout.atMost('phablet')).toBeTruthy();
      });

      it('atMost("tablet") should return true', () => {
        expect(layout.atMost('tablet')).toBeTruthy();
      });

      it('atMost("desktop") should return true', () => {
        expect(layout.atMost('desktop')).toBeTruthy();
      });

      it('lessThan("phablet") should return false', () => {
        expect(layout.lessThan('phablet')).toBeFalsy();
      });

      it('lessThan("tablet") should return true', () => {
        expect(layout.lessThan('tablet')).toBeTruthy();
      });
    });
  }

  if (getViewPortWidth() >= 768 && getViewPortWidth() < 992) {
    describe('on tablet browser', () => {
      it('is("tablet") should return true', () => {
        expect(layout.is('tablet')).toBeTruthy();
      });

      it('atLeast("tablet") should return true', () => {
        expect(layout.atLeast('tablet')).toBeTruthy();
      });

      it('atLeast("mobile") should return true', () => {
        expect(layout.atLeast('mobile')).toBeTruthy();
      });

      it('atLeast("phablet") should return true', () => {
        expect(layout.atLeast('phablet')).toBeTruthy();
      });

      it('atMost("tablet") should return true', () => {
        expect(layout.atMost('tablet')).toBeTruthy();
      });

      it('lessThan("tablet") should return false', () => {
        expect(layout.lessThan('tablet')).toBeFalsy();
      });

      it('lessThan("desktop") should return true', () => {
        expect(layout.lessThan('desktop')).toBeTruthy();
      });
    });
  }

  if (getViewPortWidth() >= 992) {
    describe('on desktop browser', () => {
      it('is("desktop") should return true', () => {
        expect(layout.is('desktop')).toBeTruthy();
      });

      it('atLeast("mobile") should return true', () => {
        expect(layout.atLeast('mobile')).toBeTruthy();
      });

      it('atMost("mobile") should return false', () => {
        expect(layout.atMost('mobile')).toBeFalsy();
      });
    });
  }
});
