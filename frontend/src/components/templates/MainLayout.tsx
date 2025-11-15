import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter,
  Utensils,
  Heart
} from 'lucide-react';
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
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={onCartClick}
      />
      <main className="flex-1">
        {children}
      </main>
      
      {/* Professional Footer */}
      <footer className="bg-gradient-to-b from-neutral-900 to-neutral-950 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <span className="font-serif text-2xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                  Le Restaurant
                </span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                Bringing you authentic flavors and exceptional dining experiences since 2020. 
                We're committed to serving the finest cuisine with impeccable service.
              </p>
              <div className="flex items-center space-x-1 text-xs text-neutral-500">
                <Heart className="w-3 h-3 text-primary-500 fill-primary-500" />
                <span>Made with passion for great food</span>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/" 
                    className="text-neutral-400 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">Menu</span>
                  </Link>
                </li>
                <li>
                  <a 
                    href="#about" 
                    className="text-neutral-400 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">About Us</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    className="text-neutral-400 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">Contact</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="#careers" 
                    className="text-neutral-400 hover:text-primary-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">Careers</span>
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <a 
                    href="tel:+15551234567" 
                    className="text-neutral-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    (555) 123-4567
                  </a>
                </li>
                <li className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <a 
                    href="mailto:hello@lerestaurant.com" 
                    className="text-neutral-400 hover:text-primary-400 transition-colors text-sm break-all"
                  >
                    hello@lerestaurant.com
                  </a>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-400 text-sm">
                    123 Food Street<br />
                    City, State 12345
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-400 text-sm">
                    Open Daily<br />
                    11:00 AM - 10:00 PM
                  </span>
                </li>
              </ul>
            </div>
            
            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-lg mb-4 text-white">Follow Us</h4>
              <p className="text-neutral-400 text-sm mb-4">
                Stay connected with us on social media for the latest updates, special offers, and behind-the-scenes content.
              </p>
              <div className="flex space-x-3">
                <a 
                  href="#" 
                  className="bg-neutral-800 hover:bg-primary-600 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="bg-neutral-800 hover:bg-primary-600 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="#" 
                  className="bg-neutral-800 hover:bg-primary-600 p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-neutral-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-neutral-500 text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} Le Restaurant. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-neutral-500">
                <a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary-400 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};