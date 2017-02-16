import React, { PropTypes } from 'react';

import TableTitle from './TableTitle';
import TableRows from './TableRows';
import styles from './Table.css';

const propTypes = {
  stockData: PropTypes.object.isRequired,
};

const Table = ({ stockData }) => (
  <div className={styles.container}>
    <h3>
      <TableTitle />
      <TableRows stockData={stockData} />
    </h3>
  </div>
);

Table.propTypes = propTypes;

export default Table;
