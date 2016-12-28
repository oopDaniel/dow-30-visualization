/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import styles from './Search.css';


class Search extends Component {

  render() {
    return (
      <div className={styles.container}>
        <input
          type="text"
          className={styles.searchbar}
          placeholder="this is a search bar" />
      </div>
    );
  }

}

Search.propTypes = {
};
/* eslint-enable */

export default Search;
