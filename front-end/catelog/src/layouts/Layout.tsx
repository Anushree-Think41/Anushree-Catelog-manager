import React from 'react';
import Filters from '../components/Filters';
import { Link } from 'react-router-dom'; // Import Link

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <div className="text-lg font-bold">Catalog Manager</div>
        <div>
          <Link to="/product-catalog" className="mr-4 hover:text-gray-300">Products</Link>
          <Link to="/insights-overview" className="hover:text-gray-300">Insights</Link>
        </div>
      </nav>

      <div className="flex flex-1">
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
