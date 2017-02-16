import React, { PropTypes } from 'react';
import TableRow from './TableRow';

const propTypes = {
  stockData: PropTypes.object.isRequired,
};

const yearRowStyle = {
  padding: '.8rem',
  textAlign: 'center',
};

const TableRows = ({ stockData }) => {
  const times = Object.keys(stockData);
  const yearMap = {};
  return (
    <div>
      {times.map((time, i) => {
        const data = stockData[time];
        const date = new Date(Number(time));
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();

        const timeStr = `${month} / ${day}`;

        let yearRow = null;
        if (yearMap[year] === undefined) {
          yearMap[year] = true;
          yearRow = <div style={yearRowStyle}>{year}</div>;
        }

        return (
          <span key={i}>
            {yearRow}
            <TableRow
              time={timeStr}
              data={data}
              key={time}
              index={i}
            />
          </span>
        );
      })}
    </div>
  );
};

TableRows.propTypes = propTypes;

export default TableRows;
