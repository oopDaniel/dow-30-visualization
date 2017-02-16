import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './TableRow.css';
import numFilter from './../../../helpers/number-filter';

const propTypes = {
  time: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  data: PropTypes.shape({
    Open: PropTypes.number.isRequired,
    Close: PropTypes.number.isRequired,
    High: PropTypes.number.isRequired,
    Low: PropTypes.number.isRequired,
    Volume: PropTypes.number.isRequired,
  }).isRequired,
};

const TableRow = ({ time, data, index }) => {
  const containerStyle = classNames({
    [styles.container]: true,
    [styles.cross_color]: index % 2 === 0,
  });

  return (
    <div className={containerStyle}>
      <span className={styles.emphasize}>{time}</span>
      <span>{numFilter(data.Open)}</span>
      <span>{numFilter(data.Close)}</span>
      <span>{numFilter(data.High)}</span>
      <span>{numFilter(data.Low)}</span>
      <span>{numFilter(data.Volume)}</span>
    </div>
  );
};

TableRow.propTypes = propTypes;

export default TableRow;
