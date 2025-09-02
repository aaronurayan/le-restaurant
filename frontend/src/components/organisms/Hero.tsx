import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '../atoms/Button';

interface HeroProps {
  onOrderNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow }) => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent-yellow fill-current" />
                ))}
              </div>
              <span className="ml-2 text-neutral-600 font-medium">4.9/5 from 500+ reviews</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-neutral-900 mb-6 leading-tight">
              Authentic Flavors,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Delivered Fresh
              </span>
            </h1>
            
            <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Experience the finest dining from the comfort of your home. Our chefs prepare each dish 
              with passion and premium ingredients, bringing restaurant-quality meals to your door.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={onOrderNow}
                size="lg"
                className="group"
              >
                Order Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
              >
                View Menu
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start space-x-8 mt-12 text-sm text-neutral-600">
              <div className="text-center">
                <div className="font-semibold text-lg text-neutral-900">15-30</div>
                <div>mins delivery</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-neutral-900">500+</div>
                <div>happy customers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-neutral-900">50+</div>
                <div>menu items</div>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Delicious restaurant meal"
                className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 animate-pulse-gentle">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <div>
                  <div className="text-sm font-semibold">Fresh Ingredients</div>
                  <div className="text-xs text-neutral-500">Farm to table</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 animate-pulse-gentle" style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🚀</span>
                </div>
                <div>
                  <div className="text-sm font-semibold">Fast Delivery</div>
                  <div className="text-xs text-neutral-500">15-30 minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-100/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-secondary-100/30 to-transparent" />
    </section>
  );
};