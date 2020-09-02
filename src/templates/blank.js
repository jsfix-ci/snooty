import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import landingStyles from '../styles/landing.module.css';

const Blank = ({ children }) => (
  <div className="content">
    <div className={`main-column ${landingStyles.fullWidth}`} id="main-column">
      <div className={landingStyles.document}>
        {children}
        <Footer />
      </div>
    </div>
  </div>
);

Blank.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default Blank;
