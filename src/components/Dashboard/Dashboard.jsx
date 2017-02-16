/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { getStocksByFocus } from './../../reducers/selectors';
import periodEnum, { today } from './../../consts/periodEnum';
import styles from './Dashboard.css';
import BarChart from './BarChart/BarChart';
import LineChart from './LineChart/LineChart';
import Table from './Table/Table';

class Dashboard extends Component {
  static propTypes = {
    stocks: PropTypes.shape({
      allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
      byName: PropTypes.object.isRequired,
    }).isRequired,
    isFetching: PropTypes.bool.isRequired,
    period: PropTypes.number.isRequired,
  }

  renderChart(period, stocks) {
    return periodEnum[period] === today
      ? <BarChart stocks={stocks} />
      : <LineChart
          stocks={stocks}
          period={period}
        />;
  }

  render() {
    const {
      stocks,
      isFetching,
      period,
    } = this.props;

    if (isFetching) {
      return (
        <div>
          <h2>Loading...</h2>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        {this.renderChart(period, stocks)}
        <Table stocks={stocks} />
      </div>
    );
  }
}


const mapStateToProps = state => ({
  stocks: getStocksByFocus(state),
  isFetching: state.isFetching,
  period: state.period,
});

const connectedDashboard = connect(mapStateToProps, null)(Dashboard);

export default connectedDashboard;
