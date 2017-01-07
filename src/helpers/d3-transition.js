const createHook = (comp, elem, stateName) => {
  const elems = new Map();
  let interval;

  const updateState = () => {
    comp.setState({ [stateName]: elem.toReact() });
    comp.forceUpdate();
  };

  // To React DOM first
  setTimeout(updateState);

  /* eslint-disable no-param-reassign */
  comp.isAnimating = () => !!interval;
  /* eslint-enable */

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
