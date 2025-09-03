import React from 'react';
import Filters from '../components/Filters';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="text-xl font-semibold">Catalog Manager</div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="text-blue-600 font-medium px-3 py-2 rounded-md bg-blue-50">Upload products</a></li>
            <li><a href="/products" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md">Products</a></li>
            <li><a href="/optimize" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md">Optimize</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md">Insights</a></li>
            <li><a href="#" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md">Settings</a></li>
          </ul>
        </nav>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-4 shadow-md">
          <Filters />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
