import React, { PropTypes } from 'react';

import styles from './Period.css';
import periodEnum from './../../../consts/periodEnum';

const propTypes = {
  period: PropTypes.number.isRequired,
  // switchHandler: PropTypes.func.isRequired,
};

// switchHandler
const Period = ({ period }) => (
  <div className={styles.container}>
    {periodEnum[period]}
  </div>
);


Period.propTypes = propTypes;


export default Period;
