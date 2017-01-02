/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { getStocksByFocus } from './../../reducers/selectors';
import styles from './Dashboard.css';
import Chart from './Chart/Chart';
import Table from './Table/Table';

class Dashboard extends Component {
  render() {
    const { stocks, isFetching } = this.props;

    if (isFetching) {
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <Chart stocks={stocks}/>
        <Table stocks={stocks}/>
      </div>
    );
  }

}

Dashboard.propTypes = {
};
/* eslint-enable */


const mapStateToProps = state => ({
  stocks: getStocksByFocus(state),
  isFetching: state.isFetching,
});

const connectedDashboard = connect(mapStateToProps, null)(Dashboard);

export default connectedDashboard;
