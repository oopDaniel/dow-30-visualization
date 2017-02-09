/* eslint-disable no-param-reassign, no-console */
import { isEmptyObj } from './util';

const createHook = (comp, elem, stateName) => {
  const elems = new Map();
  let interval;

  const updateState = () => {
    // Check ref in comp to ensure comp is still mounting
    if (!isEmptyObj(comp.refs)) {
      comp.setState({ [stateName]: elem.toReact() });

      try {
        comp.forceUpdate();
      } catch (e) {
        console.error('fail to update', e);
      }
    }
  };

  // To React DOM first
  setTimeout(updateState);

  comp.isAnimating = () => !!interval;

  return (transition) => {
    transition.each((el) => {
      elems.set(el, (elems.get(el) || new Set()).add(transition.id));
      interval = interval || setInterval(updateState, 16);
    });

    transition.each('end', (el) => {
      const anims = elems.get(el);
      if (anims) {
        anims.delete(transition.id);
        if (anims.size) {
          elems.set(el, anims);
        } else {
          elems.delete(el);
        }
      }
      if (!elems.size) interval = clearInterval(interval);
    });
  };
};

export default createHook;
