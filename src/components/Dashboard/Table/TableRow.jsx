import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import styles from './TableRow.css';
import numFilter from './../../../helpers/number-filter';

const propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number,
  stock: PropTypes.shape({
    Open: PropTypes.number.isRequired,
    Close: PropTypes.number.isRequired,
    High: PropTypes.number.isRequired,
    Low: PropTypes.number.isRequired,
    Volume: PropTypes.number.isRequired,
  }).isRequired,
};

const TableRow = ({ name, stock, index }) => {
  const containerStyle = classNames({
    [styles.container]: true,
    [styles.cross_color]: index % 2 === 0,
  });

  return (
    <div className={containerStyle}>
      <Link
        to={`/detail/${name}`}
        className={styles.title}
        activeStyle={{
          textDecoration: 'none',
          color: 'black',
        }}
      >
        {name}
      </Link>
      <span>{numFilter(stock.Open)}</span>
      <span>{numFilter(stock.Close)}</span>
      <span>{numFilter(stock.High)}</span>
      <span>{numFilter(stock.Low)}</span>
      <span>{numFilter(stock.Volume)}</span>
    </div>
  );
};

TableRow.propTypes = propTypes;

export default TableRow;
