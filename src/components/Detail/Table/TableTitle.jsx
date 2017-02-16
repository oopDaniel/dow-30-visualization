import React from 'react';

import styles from './TableRow.css';


const TableTitle = () => {
  const containerStyle = `${styles.border_title} ${styles.container}`;

  return (
    <div className={containerStyle}>
      <span>Date</span>
      <span>Open</span>
      <span>Close</span>
      <span>High</span>
      <span>Low</span>
      <span>Volume</span>
    </div>
  );
};

export default TableTitle;
