import React, { Component, PropTypes } from 'react';
import styles from './App.css';
import Search from './../Search/Search';

/* eslint-disable */
class App extends Component {

  render() {
    return (
      <div className={styles.container}>
        <Search />
        {this.props.children}
      </div>
    );
  }
}
/* eslint-enable */
/* eslint-disable react/forbid-prop-types */
App.propTypes = {
  children: PropTypes.object,
};
/* eslint-enable */

export default App;
