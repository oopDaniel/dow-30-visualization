/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styles from './Table.css';

class Table extends Component {

  render() {
    return (
      <div className={styles.container}>
          <h2>
            Hi table
          </h2>
      </div>
    );
  }

}

Table.propTypes = {
};
/* eslint-enable */

const mapStateToProps = state => ({
  stocks: state.stocks,
});

const connectedTable = connect(mapStateToProps)(Table);
export default connectedTable;
