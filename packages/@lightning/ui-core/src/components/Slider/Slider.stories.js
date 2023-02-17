import lng from '@lightningjs/core';
import { createModeControl } from 'lightning-ui-docs/.storybook/utils';
import TextBox from '../TextBox/index.js';
import mdx from './Slider.mdx';
import Slider from '.';
import { CATEGORIES } from 'lightning-ui-docs';
import { useArgs } from '@storybook/client-api';

export default {
  title: `${CATEGORIES[512]}/Slider`,
  parameters: {
    docs: {
      page: mdx
    }
  }
};

export const Basic = () => {
  const [{ value }, updateArgs] = useArgs();
  return class Basic extends lng.Component {
    static _template() {
      return {
        Slider: {
          type: Slider,
          value: value,
          signals: {
            onChange: true
          }
        }
      };
    }
    // update arg control when value changes
    onChange(value) {
      updateArgs({ value });
    }
  };
};

Basic.args = {
  min: 0,
  max: 100,
  value: 50,
  step: 1,
  vertical: false,
  mode: 'focused'
};

Basic.argTypes = {
  ...createModeControl({ summaryValue: 'focused' }),
  min: {
    control: 'number',
    description: 'Lower bound of value',
    table: { defaultValue: { summary: 0 } }
  },
  max: {
    control: 'number',
    description: 'Upper bound of value',
    table: { defaultValue: { summary: 100 } }
  },
  value: {
    control: 'number',
    description: 'Current value',
    table: { defaultValue: { summary: '0 or min' } }
  },
  step: {
    control: 'number',
    description: '+/- value on change',
    table: { defaultValue: { summary: 1 } }
  },
  vertical: {
    control: 'boolean',
    description: 'If true, the slider is displayed vertically',
    table: { defaultValue: { summary: false } }
  }
};

export const SignalHandling = () =>
  class SignalHandling extends lng.Component {
    static _template() {
      return {
        flex: { direction: 'column' },
        Slider: {
          type: Slider,
          step: 10,
          y: 15,
          w: 328,
          signals: {
            onChange: true
          }
        },
        Text: {
          y: 60,
          type: TextBox
        }
      };
    }

    onChange(value) {
      this.tag('Text').content = `Value: ${value}`;
    }
  };
SignalHandling.args = {
  mode: 'focused'
};

SignalHandling.argTypes = createModeControl({ summaryValue: 'focused' });
