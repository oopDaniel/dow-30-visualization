import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import className from 'classnames';
import styles from './TableRow.css';

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
  const containerStyle = className({
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
      <span>{stock.Open}</span>
      <span>{stock.Close}</span>
      <span>{stock.High}</span>
      <span>{stock.Low}</span>
      <span>{stock.Volume}</span>
    </div>
  );
};

TableRow.propTypes = propTypes;

export default TableRow;
