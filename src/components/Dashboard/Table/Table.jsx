import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import TableTitle from './TableTitle';
import TableRows from './TableRows';
// import { getLatestStocks } from './../../../reducers/selectors';
import styles from './Table.css';

const propTypes = {
  stocks: PropTypes.shape({
    allNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    byName: PropTypes.object.isRequired,
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
};

/* eslint-disable*/
class Table extends Component {

  render() {
    const { isFetching, stocks } = this.props;
    if (isFetching) {
      return (
        <div className={styles.container}>
          <h2>Loading...</h2>
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <h3>
          <TableTitle />
          <TableRows stocks={stocks} />
        </h3>
      </div>
    );
  }

}

Table.propTypes = propTypes;

/* eslint-enable */

const mapStateToProps = state => ({
  stocks: state.stocks,
  isFetching: state.isFetching,
});

const connectedTable = connect(mapStateToProps, null)(Table);
export default connectedTable;
