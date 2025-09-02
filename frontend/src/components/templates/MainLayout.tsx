import React from 'react';
import { Header } from '../organisms/Header';

interface MainLayoutProps {
  children: React.ReactNode;
  cartItemCount: number;
  onCartClick: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  cartItemCount,
  onCartClick,
}) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={onCartClick}
      />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-serif text-xl font-bold">Le Restaurant</span>
              </div>
              <p className="text-neutral-400 text-sm">
                Bringing you authentic flavors and exceptional dining experiences since 2020.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#menu" className="hover:text-white transition-colors">Menu</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>📞 (555) 123-4567</li>
                <li>📧 hello@lerestaurant.com</li>
                <li>📍 123 Food Street, City</li>
                <li>🕒 Open 11AM - 10PM daily</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="bg-neutral-800 p-2 rounded-lg hover:bg-neutral-700 transition-colors">
                  📘
                </a>
                <a href="#" className="bg-neutral-800 p-2 rounded-lg hover:bg-neutral-700 transition-colors">
                  📷
                </a>
                <a href="#" className="bg-neutral-800 p-2 rounded-lg hover:bg-neutral-700 transition-colors">
                  🐦
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-400">
            <p>&copy; 2025 Le Restaurant. All rights reserved. Built with 💜 for great food.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};