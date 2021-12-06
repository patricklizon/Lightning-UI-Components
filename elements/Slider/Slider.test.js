import TestUtils from '../../test/lightning-test-utils';
import Slider from '.';

const createSlider = TestUtils.makeCreateComponent(Slider);

describe('Slider', () => {
  let slider, testRenderer;

  beforeEach(() => {
    [slider, testRenderer] = createSlider();
    testRenderer.update();
  });
  afterEach(() => {
    slider = null;
    testRenderer = null;
  });

  it('renders', () => {
    const tree = testRenderer.toJSON(2);
    expect(tree).toMatchSnapshot();
  });

  it('sets properties', () => {
    [slider, testRenderer] = createSlider({
      min: 1,
      max: 10,
      step: 0.5,
      value: 5
    });
    testRenderer.update();
    const tree = testRenderer.toJSON(2);
    expect(tree).toMatchSnapshot();
  });

  it('sets the inital LeftBar and Circle textures without smoothing', () => {
    [slider, testRenderer] = createSlider({
      min: 1,
      max: 10,
      step: 1,
      value: 5
    });

    expect(slider._LeftBar.w).toBeGreaterThan(0);
  });

  describe('key handling', () => {
    describe('right', () => {
      beforeEach(() => {
        [slider, testRenderer] = createSlider({
          max: 2,
          value: 0
        });
      });

      it('increases the value', () => {
        slider._handleRight();
        expect(slider.value).toEqual(1);
      });

      it('stops increasing at max value', () => {
        slider._handleRight();
        slider._handleRight();
        expect(slider.value).toEqual(2);
        slider._handleRight();
        expect(slider.value).toEqual(2);
      });

      it('updates the LeftBar and Circle textures with smoothing', async () => {
        [slider, testRenderer] = createSlider(
          {},
          { spyOnMethods: ['_update'] }
        );
        await slider.__updateSpyPromise;
        const initialWidth = slider._LeftBar.w;
        expect(slider._LeftBar.w).toEqual(initialWidth);

        testRenderer.keyPress('Right');
        await slider.__updateSpyPromise;

        TestUtils.fastForward(slider._LeftBar);
        testRenderer.update();
        const updatedWidth = testRenderer.getInstance()._LeftBar.w;
        expect(updatedWidth).toBeGreaterThan(initialWidth);
      });
    });

    describe('left', () => {
      beforeEach(() => {
        [slider, testRenderer] = createSlider({
          max: 2,
          value: 2
        });
      });

      it('decreases the value', () => {
        slider._handleLeft();
        expect(slider.value).toEqual(1);
      });

      it('stops decreasing at the min value', () => {
        slider._handleLeft();
        slider._handleLeft();
        expect(slider.value).toEqual(0);
        slider._handleLeft();
        expect(slider.value).toEqual(0);
      });

      it('updates the LeftBar and Circle textures with smoothing', async () => {
        [slider, testRenderer] = createSlider(
          {
            max: 2,
            value: 2
          },
          {
            spyOnMethods: ['_update']
          }
        );
        await slider.__updateSpyPromise;
        const initialWidth = slider._LeftBar.w;
        expect(slider._LeftBar.w).toEqual(initialWidth);

        testRenderer.keyPress('Left');
        await slider.__updateSpyPromise;

        TestUtils.fastForward(slider._LeftBar);
        testRenderer.update();
        const updatedWidth = testRenderer.getInstance()._LeftBar.w;
        expect(updatedWidth).toBeLessThan(initialWidth);
      });
    });
  });

  describe('onChange signal', () => {
    beforeEach(() => {
      Slider.prototype.signal = jest.fn();
      [slider, testRenderer] = createSlider({
        value: 50
      });
    });

    it('is fired on init', () => {
      expect(slider.signal).toBeCalledWith('onChange', 50, slider);
    });

    it('is fired on key left', async () => {
      [slider, testRenderer] = createSlider(
        { value: 50 },
        { spyOnMethods: ['_update'] }
      );
      await slider.__updateSpyPromise;
      slider._handleLeft();
      await slider.__updateSpyPromise;
      expect(slider.signal).toBeCalledWith('onChange', 49, slider);
    });

    it('is fired on key right', async () => {
      [slider, testRenderer] = createSlider(
        { value: 50 },
        { spyOnMethods: ['_update'] }
      );
      await slider.__updateSpyPromise;
      slider._handleRight();
      await slider.__updateSpyPromise;
      expect(slider.signal).toBeCalledWith('onChange', 51, slider);
    });
  });
});
