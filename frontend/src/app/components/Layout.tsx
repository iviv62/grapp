import React from 'react';
import TopNav from './TopNav';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <TopNav />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
