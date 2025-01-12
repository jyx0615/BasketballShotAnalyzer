import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} Shot Analysis Pro. All rights reserved.</p>
      </div>
    </footer>
  );
}