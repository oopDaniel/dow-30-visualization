import React, { PropTypes } from 'react';
import styles from './Tags.css';

const propTypes = {
  focus: PropTypes.arrayOf(PropTypes.string).isRequired,
  closeHandler: PropTypes.func.isRequired,
};


const Tags = ({ focus, closeHandler }) => (
  <div className={styles.container}>
    {focus.map(name => (
      <span
        className={styles.tag}
        key={name}
      >
        {name}
        <strong
          className={styles.strong}
          onClick={() => closeHandler(name)}
        >
          &times;
        </strong>
      </span>
    ))}
  </div>
);


Tags.propTypes = propTypes;


export default Tags;
