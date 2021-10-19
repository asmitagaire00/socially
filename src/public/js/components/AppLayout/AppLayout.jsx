import React from 'react';
import PropTypes from 'prop-types';

import Header from '../Header';
import Sidebar from '../Sidebar';
import SidebarRight from '../SidebarRight/SidebarRight';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-layout__main">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="app-layout__feed">{children}</div>
        <div className="sidebar-right">
          <SidebarRight />
        </div>
      </div>
    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default AppLayout;
