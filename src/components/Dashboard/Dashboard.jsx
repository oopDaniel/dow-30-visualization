/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

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


const mapStateToProps = state => ({
  focus: state.focus,
  search: state.search,
});

const connectedDashboard = connect(mapStateToProps, null)(Dashboard);

export default connectedDashboard;
