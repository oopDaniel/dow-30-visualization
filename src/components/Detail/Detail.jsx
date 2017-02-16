/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';

import Table from './Table/Table';
import { fetchLatestRequest } from './../../actions/index';
import styles from './Detail.css';


class Detail extends Component {
  static propTypes = {
    stock: PropTypes.shape({
      data: PropTypes.object,
    }),
    fetchLatestRequest: PropTypes.func.isRequired,
  };

  static defaultProps = {
    stock: { data: {} },
  };

  render() {
    const { stock, params } = this.props;
    const name = params.name;
    return (
      <div className={styles.container}>
        <h1>
          {name}'s Details
        </h1>
        <Table stockData={stock.data} />
        <IndexLink to={`/`}>
          Back
        </IndexLink>
      </div>
    );
  }

}

Detail.propTypes = {
};

const mapStateToProps = (state, props) => ({
  stock: state.stocks.byName[props.params.name],
});

const connectedDetail = connect(mapStateToProps, { fetchLatestRequest })(Detail);

export default connectedDetail;
