import React, { PropTypes } from 'react';
import TableRow from './TableRow';

const propTypes = {
  stocks: PropTypes.shape({
    allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    byName: PropTypes.object.isRequired,
  }).isRequired,
};

const TableRows = ({ stocks }) => (
  <div>
    {stocks.allNames.map((name, i) => {
      const stock = stocks.byName[name];
      const time  = stock.latest[1];

      return (
        <TableRow
          name={name}
          stock={stock.data[time]}
          index={i}
          key={name}
        />
      );
    })}
  </div>
);

TableRows.propTypes = propTypes;

export default TableRows;
