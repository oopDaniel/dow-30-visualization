/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import styles from './Chart.css';


class Chart extends Component {

  render() {
    return (
      <div className={styles.container}>
          <svg className={styles.svg_container}>
            <circle r="10" cx="10" cy="10" fill="#ff8282"></circle>
            <circle r="10" cx="50" cy="10" fill="#e0e0e4"></circle>
            <circle r="10" cx="15" cy="50" fill="#1FC2F9"></circle>
            <circle r="20" cx="64" cy="50" fill="#52bd7e"></circle>
          </svg>
      </div>
    );
  }

}

Chart.propTypes = {
};
/* eslint-enable */

export default Chart;
