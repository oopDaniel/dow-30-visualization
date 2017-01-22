/* eslint-disable import/no-named-as-default-member */
import { SWITCH_PERIOD } from './../consts/actionTypes';
import PERIOD, { today } from './../consts/periodEnum';

function period(state = PERIOD[today], action) {
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
