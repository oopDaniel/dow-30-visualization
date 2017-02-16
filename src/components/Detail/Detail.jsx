/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import { IndexLink } from 'react-router';
// import styles from './Detail.css';


class Detail extends Component {

  render() {
    return (
      <div /*className={styles.container}*/>
        <h1>
          The Detail
        </h1>
        <IndexLink
          to={`/`}
          // className={styles.title}
          // activeStyle={{
          //   textDecoration: 'none',
          //   color: 'black',
          // }}
        >
          Back
        </IndexLink>
      </div>
    );
  }

}

Detail.propTypes = {
};
/* eslint-enable */

export default Detail;
