/**
 * List Item Component
 *
 * List Item Class that contains styling and functionality for all ListItems, including
 * RadioListItems and SeriesSeasonListItems.
 *
 */
import lng from '@lightningjs/core';
import Icon from '../Icon';
import Row from '../Row';
import Slider from '../Slider';
import Tile from '../Tile';
import Toggle from '../Toggle';
import Radio from '../Radio';
import { Arrow } from '../textures';
import { RoundRect, getFirstNumber } from '../../utils';
import withStyles from '../../mixins/withStyles';

export const baseStyles = theme => ({
  h: 88,
  backgrounds: theme.palette.background,
  backgroundType: 'fill',
  dimensions: {
    large: 860,
    small: 410
  },
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  radius: theme.border.radius.small
});

export class ListItemBase extends withStyles(
  class extends lng.Component {
    static _template() {
      return {
        h: this.styles.h,
        backgroundType: 'fill',
        color: this.styles.backgrounds.fill,
        Container: {
          flex: {
            direction: 'row',
            wrap: true,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: this.styles.paddingLeft,
            paddingRight: this.styles.paddingRight
          },
          Left: { flex: { direction: 'column' } },
          Right: { flex: { direction: 'column' } }
        }
      };
    }

    _init() {
      // Init Container
      const w =
        this.w ||
        this.styles.dimensions[this.size] ||
        this.styles.dimensions.large;
      const color = getFirstNumber(
        this.styles.backgrounds[this.backgroundType],
        this.styles.backgrounds.fill
      );
      const texture = lng.Tools.getRoundRect(
        RoundRect.getWidth(w, { padding: this.styles.paddingLeft }),
        RoundRect.getHeight(this.h),
        this.styles.radius
      );

      this._Container.patch({
        color,
        texture
      });
    }

    _focus() {
      this._Container.smooth = {
        color: this.styles.backgrounds.focus
      };
    }

    _unfocus() {
      this._Container.smooth = {
        color: getFirstNumber(
          this.styles.backgrounds[this.backgroundType],
          this.styles.backgrounds.fill
        )
      };
    }

    _handleEnter() {
      if (typeof this.onEnter === 'function') {
        this.onEnter(this);
      }
    }

    get announce() {
      return this._announce
        ? this._announce
        : this.title + ` ${this.subtitle !== undefined ? this.subtitle : ''}`;
    }

    set announce(announce) {
      if (this._announce !== announce) {
        this._announce = announce;
      }
    }

    get _Container() {
      return this.tag('Container');
    }

    get _Left() {
      return this._Container.tag('Left');
    }

    get _Right() {
      return this._Container.tag('Right');
    }
  },
  baseStyles
) {}

export const styles = theme => ({
  icon: {
    width: 40,
    height: 40,
    color: theme.palette.text.light.primary
  },
  title: {
    color: theme.palette.text.light.primary,
    text: {
      ...theme.typography.button1,
      verticalAlign: 'top'
    }
  },
  subtitle: {
    color: theme.palette.text.light.secondary,
    text: {
      ...theme.typography.body3,
      verticalAlign: 'top'
    }
  },
  focused: {
    icon: {
      color: theme.palette.text.dark.primary
    },
    title: {
      color: theme.palette.text.dark.primary
    },
    subtitle: {
      color: theme.palette.text.dark.secondary
    }
  }
});

export default class ListItem extends withStyles(ListItemBase, styles) {
  _init() {
    super._init();

    const left = {};
    const right = {};

    if (this.icon !== undefined) {
      right.flex = {
        direction: 'row'
      };

      [...(Array.isArray(this.icon) ? this.icon : [this.icon])].forEach(
        (icon, index) => {
          right[`Icon${index || ''}`] = {
            type: Icon,
            h: this.styles.icon.height,
            w: this.styles.icon.width,
            color: this.styles.icon.color,
            icon
          };
        }
      );
    }

    this._Left.patch({ ...left });
    this._Right.patch({ ...right });
    !this.hasFocus() && this._unfocus();
  }

  _getTitleW() {
    const w =
      this.w ||
      this.styles.dimensions[this.size] ||
      this.styles.dimensions.large;

    return (
      w - this.styles.paddingLeft - this.styles.paddingRight - this._rightOffset
    );
  }

  _focus() {
    super._focus();
    this._Title &&
      this._Title.setSmooth('color', this.styles.focused.title.color);
    this._Subtitle &&
      this._Subtitle.setSmooth('color', this.styles.focused.subtitle.color);
    (this._icons || []).length &&
      this._icons.forEach(icon =>
        icon.setSmooth('color', this.styles.focused.icon.color)
      );

    this._Left.smooth = { y: 0 };
  }

  _unfocus() {
    super._unfocus();
    this._Title && this._Title.setSmooth('color', this.styles.title.color);
    this._Subtitle &&
      this._Subtitle.setSmooth(
        'color',
        this.collapse ? 0 : this.styles.subtitle.color
      );
    (this._icons || []).length &&
      this._icons.forEach(icon =>
        icon.setSmooth('color', this.styles.icon.color)
      );

    this.collapse &&
      this._Subtitle &&
      this._Left.setSmooth('y', this._Subtitle.renderHeight / 2);
  }

  set title(title) {
    this._title = title;
    this._Left.patch({
      Title: {
        h: this.styles.title.text.lineHeight,
        color: this.styles.title.color,
        text: {
          ...this.styles.title.text,
          wordWrapWidth: this._getTitleW(),
          maxLines: 1,
          maxLinesSuffix: '...',
          text: title
        }
      }
    });
  }

  set subtitle(subtitle) {
    this._subtitle = subtitle;
    if (subtitle) {
      this._Left.patch({
        Title: {},
        Subtitle: {
          h: this.styles.subtitle.text.lineHeight,
          text: {
            ...this.styles.subtitle.text,
            text: subtitle
          }
        }
      });
    } else {
      this._Left.patch({ Subtitle: undefined });
    }

    this.hasFocus() ? this._focus() : this._unfocus();
    this._refocus();
  }

  get _Title() {
    return this._Left.tag('Title');
  }

  get _Subtitle() {
    return this._Left.tag('Subtitle');
  }

  get _Icon() {
    return this._Right.tag('Icon');
  }

  get _icons() {
    return this._Right.children;
  }

  get _rightOffset() {
    if (this.icon !== undefined) {
      return (
        [...(Array.isArray(this.icon) ? this.icon : [this.icon])].length *
          this.styles.icon.width +
        16
      );
    }
    return 0;
  }

  get title() {
    return this._title;
  }

  get subtitle() {
    return this._subtitle;
  }
}

export class ListItemToggle extends ListItem {
  _init() {
    super._init();
    this.icon = undefined;
    this._Right.patch({
      w: 64,
      h: 32,
      Toggle: {
        type: Toggle,
        checked: this.checked
      }
    });
  }

  _getTitleW() {
    const w =
      this.w ||
      this.styles.dimensions[this.size] ||
      this.styles.dimensions.large;

    return w - this.styles.paddingLeft - this.styles.paddingRight - 72;
  }

  isChecked() {
    return Boolean(this._Toggle.checked);
  }

  toggle() {
    return this._Toggle.toggle();
  }

  _getFocused() {
    return this._Toggle;
  }

  _handleEnter() {
    this._Toggle._handleEnter();
  }

  get onEnter() {
    return this._Toggle.onEnter;
  }

  set onEnter(onEnter) {
    this._Toggle.onEnter = onEnter;
  }

  get _Toggle() {
    return this.tag('Container').tag('Toggle');
  }

  get _rightOffset() {
    return 72;
  }
}

export class ListItemRadio extends ListItem {
  _init() {
    super._init();
    this.icon = undefined;
    this._Right.patch({
      w: 32,
      h: 32,
      Radio: {
        type: Radio,
        checked: this.checked
      }
    });
  }

  isChecked() {
    return Boolean(this._Radio.checked);
  }

  toggle() {
    return this._Radio.toggle();
  }

  _getFocused() {
    return this._Radio;
  }

  _handleEnter() {
    this._Radio._handleEnter();
  }

  get _Radio() {
    return this.tag('Container').tag('Radio');
  }

  get _rightOffset() {
    return 40;
  }
}

export class ListItemImage extends ListItem {
  static _template() {
    const template = super._template();
    return {
      ...template,
      Container: {
        Image: {
          type: Tile,
          flexItem: {
            marginRight: 16
          },
          rounded: 8,
          h: 56,
          w: 56
        },
        ...template.Container,
        flex: {
          ...template.Container.flex,
          justifyContent: 'flex-start'
        }
      }
    };
  }

  _init() {
    super._init();

    if (this.icon) {
      this._Right.patch({
        flex: {
          justifyContent: 'flex-end'
        },
        flexItem: {
          grow: 1
        }
      });
    }
    this._Image.patch({ src: this.image });
  }

  get _Image() {
    return this._Container.tag('Image');
  }

  get _rightOffset() {
    return 72;
  }
}

export class ListItemSlider extends ListItem {
  static _template() {
    return {
      ...super._template(),
      Container: {
        ...super._template().Container,
        Right: {
          ...super._template().Right,
          Slider: {
            type: Slider,
            alpha: 0,
            signals: {
              onChange: '_onSliderChange'
            }
          }
        }
      }
    };
  }

  _init() {
    this.icon = undefined;
    super._init();
  }

  _focus() {
    super._focus();
    this._Slider.smooth = { alpha: 1 };
    this._Container.patch({
      flex: {
        direction: 'column',
        justifyContent: 'space-around'
      }
    });
    this.stage.update();
    this._Left.patch({
      y: -1,
      w: this._Container.finalW - 32,
      flex: {
        direction: 'row',
        justifyContent: 'space-between'
      }
    });
    this._Right.patch({
      w: this._Container.finalW - 32,
      h: 0,
      y: -10,
      flex: {
        direction: 'row',
        justifyContent: 'center'
      }
    });
  }

  _unfocus() {
    super._unfocus();
    this._Slider.smooth = { alpha: 0 };
    this._Container.patch({
      flex: {
        direction: 'row',
        justifyContent: 'flex-start'
      }
    });
    this.stage.update();
    this._Left.patch({
      y: 10,
      w: 0,
      flex: {
        direction: 'column',
        justifyContent: 'flex-end'
      }
    });
    this._Right.patch({
      w: 0,
      h: 0,
      flex: {
        direction: 'column'
      }
    });
  }

  _getFocused() {
    return this._Slider;
  }

  _onSliderChange(value, slider) {
    if (this._Subtitle) {
      this._Subtitle.text.text = value;
      this.signal('onSliderChange', value, slider);
    }
  }

  get max() {
    return this._Slider.max;
  }

  set max(max) {
    this._Slider.max = max;
  }

  get min() {
    return this._Slider.min;
  }

  set min(min) {
    this._Slider.min = min;
  }

  // only supports 'small' size
  get size() {
    return 'small';
  }

  get step() {
    return this._Slider.step;
  }

  set step(step) {
    this._Slider.step = step;
  }

  get subtitle() {
    return this.value;
  }

  get value() {
    return this._Slider.value;
  }

  set value(value) {
    this._Slider.value = value;
  }

  get _Slider() {
    return this.tag('Container.Right.Slider');
  }

  get _rightOffset() {
    return 0;
  }
}

export class ListItemPicker extends ListItem {
  _construct() {
    super._construct();
    this._whenEnabled = new Promise(
      resolve => (this._firstActive = resolve),
      console.error
    );
    this._options = [];
    this._selectedOptionIndex = 0;
  }
  _init() {
    this.subtitle = this.selectedOption;
    super._init();
    this._Container.patch({
      LeftArrow: {
        visible: this.hasFocus(),
        flexItem: false,
        mount: 0.5,
        x: 24,
        y: h => h / 2,
        texture: {
          type: Arrow,
          direction: 'left',
          h: 25,
          w: 14
        }
      },
      RightArrow: {
        visible: this.hasFocus(),
        flexItem: false,
        mount: 0.5,
        x: w => w - 24,
        y: h => h / 2,
        texture: {
          type: Arrow,
          direction: 'right',
          h: 25,
          w: 14
        }
      }
    });
    this._update();
  }

  _unfocus() {
    super._unfocus();
    this._update();
  }

  _focus() {
    super._focus();
    this._update();
  }

  _updateArrows() {
    this._Container.patch({
      LeftArrow: {
        visible: this.hasFocus()
      },
      RightArrow: {
        visible: this.hasFocus()
      }
    });
  }

  _updateCarousel() {
    this._Left.patch({
      Carousel: {
        type: Row,
        h: this.styles.subtitle.text.lineHeight,
        w: this._Left.finalW,
        visible: this.hasFocus(),
        alwaysScroll: true,
        scrollMount: 0,
        clipping: true,
        items: this.options.map(option => ({
          h: this.styles.subtitle.text.lineHeight,
          w: this._Left.finalW,
          text: {
            ...this.styles.subtitle.text,
            textAlign: 'center',
            textColor: this.styles.focused.subtitle.color,
            text: option
          }
        })),
        signals: {
          selectedChange: '_onSelectedChange'
        }
      }
    });

    // TODO: hack to get around wonky rendering when selectedIndex > 1
    // can remove when issue is resolved in Row/FocusManager
    const { _selectedOptionIndex } = this;
    while (
      Number.isInteger(_selectedOptionIndex) &&
      _selectedOptionIndex !== this._Carousel.selectedIndex
    ) {
      if (_selectedOptionIndex > this._Carousel.selectedIndex) {
        this._Carousel.selectedIndex++;
      } else {
        this._Carousel.selectedIndex--;
      }
    }
  }

  _updateLeft() {
    this._Left.patch({
      flex: {
        alignItems: this.hasFocus() ? 'center' : 'flex-start'
      },
      flexItem: {
        grow: 1
      }
    });
  }

  _updateTitle() {
    this._Left.patch({
      Title: {
        h: this.styles.title.text.lineHeight,
        text: { textAlign: this.hasFocus() ? 'center' : 'left' }
      }
    });
  }

  _updateSubtitle() {
    this._Left.patch({
      Subtitle: {
        visible: !this.hasFocus(),
        text: this.selectedOption
      }
    });
  }

  _update() {
    this._whenEnabled.then(() => {
      this._updateLeft();
      this._updateArrows();
      this._updateCarousel();
      this._updateTitle();
      this._updateSubtitle();
    });
  }

  _getFocused() {
    return this._Carousel;
  }

  _onSelectedChange() {
    if (this._selectedOptionIndex !== this._Carousel.selectedIndex) {
      this._selectedOptionIndex = this._Carousel.selectedIndex;
      this.fireAncestors(
        '$listItemPickerChanged',
        this.selectedOption,
        this._selectedOptionIndex,
        this
      );
      if (this._Carousel.selectedIndex === 0) {
        this._Container.tag('LeftArrow').smooth = { alpha: 0.48 };
      } else if (this._Carousel.selectedIndex === this.options.length - 1) {
        this._Container.tag('RightArrow').smooth = { alpha: 0.48 };
      } else {
        this._Container.patch({
          LeftArrow: {
            smooth: {
              alpha: 1
            }
          },
          RightArrow: {
            smooth: {
              alpha: 1
            }
          }
        });
      }
    }
  }

  get selectedOption() {
    return this.options[this._selectedOptionIndex];
  }

  get selectedOptionIndex() {
    return this._selectedOptionIndex;
  }

  set selectedOptionIndex(index) {
    if (index !== this._selectedOptionIndex) {
      this._selectedOptionIndex = index;
      this._update();
    }
  }

  get options() {
    return this._options;
  }

  set options(options) {
    if (options !== this._options) {
      this._options = options;
      this._update();
    }
  }

  get _Carousel() {
    return this.tag('Container.Left.Carousel');
  }
}
