import * as React from 'react';
import type { Dayjs } from 'dayjs';

import genPurePanel from '../_util/PurePanel';
import type { InputStatus } from '../_util/statusUtils';
import { devUseWarning } from '../_util/warning';
import DatePicker from '../date-picker';
import type { PickerTimeProps, RangePickerTimeProps } from '../date-picker/generatePicker';

const { TimePicker: InternalTimePicker, RangePicker: InternalRangePicker } = DatePicker;

export interface TimePickerLocale {
  placeholder?: string;
  rangePlaceholder?: [string, string];
}

export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<Dayjs>, 'picker'> {
  popupClassName?: string;
}

const RangePicker = React.forwardRef<any, TimeRangePickerProps>((props, ref) => (
  <InternalRangePicker {...props} picker="time" mode={undefined} ref={ref} />
));

export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {
  addon?: () => React.ReactNode;
  status?: InputStatus;
  popupClassName?: string;
  rootClassName?: string;
}

const TimePicker = React.forwardRef<any, TimePickerProps>(
  ({ addon, renderExtraFooter, ...restProps }, ref) => {
    if (process.env.NODE_ENV !== 'production') {
      const warning = devUseWarning();

      warning(
        !addon,
        'TimePicker',
        'deprecated',
        '`addon` is deprecated. Please use `renderExtraFooter` instead.',
      );
    }

    const internalRenderExtraFooter = React.useMemo(() => {
      if (renderExtraFooter) {
        return renderExtraFooter;
      }

      if (addon) {
        return addon;
      }
      return undefined;
    }, [addon, renderExtraFooter]);

    return (
      <InternalTimePicker
        {...restProps}
        mode={undefined}
        ref={ref}
        renderExtraFooter={internalRenderExtraFooter}
      />
    );
  },
);

if (process.env.NODE_ENV !== 'production') {
  TimePicker.displayName = 'TimePicker';
}

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(TimePicker, 'picker');
(TimePicker as MergedTimePicker)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

type MergedTimePicker = typeof TimePicker & {
  RangePicker: typeof RangePicker;
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};

(TimePicker as MergedTimePicker).RangePicker = RangePicker;
(TimePicker as MergedTimePicker)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

export default TimePicker as MergedTimePicker;
