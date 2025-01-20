import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthHeader() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 my-4">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">MyLogo</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 text-xl">
              Hero
            </Link>
          </li>
          <li>
            <Link
              to="/main"
              className="text-gray-700 hover:text-blue-600 text-xl">
              Main
            </Link>
          </li>
          <li>
            <Link
              to="/tale/share"
              className="text-gray-700 hover:text-blue-600 text-xl">
              Share
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
