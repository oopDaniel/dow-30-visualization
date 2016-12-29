import React, { PropTypes } from 'react';

import TableTitle from './TableTitle';
import TableRows from './TableRows';
import styles from './Table.css';

const propTypes = {
  stocks: PropTypes.shape({
    allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    byName: PropTypes.object.isRequired,
  }).isRequired,
};

const Table = ({ stocks }) => (
  <div className={styles.container}>
    <h3>
      <TableTitle />
      <TableRows stocks={stocks} />
    </h3>
  </div>
);

Table.propTypes = propTypes;

export default Table;
