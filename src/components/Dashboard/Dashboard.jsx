/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import styles from './Dashboard.css';

import Chart from './Chart/Chart';
import Table from './Table/Table';

class Dashboard extends Component {

  render() {
    return (
      <div className={styles.container}>
        <Chart />
        <Table />
      </div>
    );
  }

}

Dashboard.propTypes = {
};
/* eslint-enable */

export default Dashboard;
