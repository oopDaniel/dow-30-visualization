import React, { PropTypes } from 'react';
import styles from './SearchSugestion.css';


// Stateless Functional Component
const Scrollable = props => (
  <div className={styles.scrollable_wrapper}>
    {props.children}
  </div>
);

Scrollable.propTypes = {
  children: PropTypes.any,
};


const propTypes = {
  isSearching: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  clickHandler: PropTypes.func.isRequired,
};

const defaultProps = {
  isSearching: false,
};

const SearchSugestion = ({ isSearching, options, clickHandler }) => {
  if (isSearching) {
    return (
      <div className={styles.container}>
        <Scrollable>
          {options.map(name => (
            <span
              onMouseDown={() => clickHandler(name)}
              key={name}
            >
              {name}
            </span>
          ))}
        </Scrollable>
      </div>
    );
  }
  return null;
};

SearchSugestion.propTypes = propTypes;
SearchSugestion.defaultProps = defaultProps;

export default SearchSugestion;
