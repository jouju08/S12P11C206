import React from 'react';
import { Link } from 'react-router-dom';

export default function DefaultHeader() {
  return (
    <header>
      <nav>
        <Link
          to="/login"
          className="text-gray-700 hover:text-blue-600 text-xl">
          Login
        </Link>
      </nav>
    </header>
  );
}
