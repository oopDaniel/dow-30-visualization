/* eslint-disable import/no-named-as-default-member */
import { SWITCH_PERIOD } from './../consts/actionTypes';
import PERIOD, { oneMonth } from './../consts/periodEnum';

function period(state = PERIOD[oneMonth], action) {
  switch (action.type) {
    case SWITCH_PERIOD: {
      return PERIOD[action.period];
    }
    default: {
      return state;
    }
  }
}

export default period;
