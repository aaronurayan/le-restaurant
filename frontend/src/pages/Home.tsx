import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/organisms/Hero';
import { CategoryFilter } from '../components/organisms/CategoryFilter';
import { MenuGrid } from '../components/molecules/MenuGrid';
import { OrderStatus } from '../components/organisms/OrderStatus';
import { mockOrders } from '../data/mockData';
import { MenuItem } from '../types';
import { useMenuApi } from '../hooks/useMenuApi';

interface HomeProps {
  onAddToCart: (item: MenuItem, quantity: number) => void;
  favoritedItems: Set<string>;
  onFavorite: (item: MenuItem) => void;
}

//This is a comment in the order management branch
export const Home: React.FC<HomeProps> = ({
  onAddToCart,
  favoritedItems,
  onFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // API hook usage
  const {
    menuItems,
    categories,
    loading,
    error,
    isBackendConnected,
    loadMenuItemsByCategory,
  } = useMenuApi();

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    if (!selectedCategory) return menuItems;
    return menuItems.filter(item => item.categoryId === selectedCategory);
  }, [selectedCategory, menuItems]);

  const handleCategorySelect = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    
    if (categoryId) {
      await loadMenuItemsByCategory(categoryId);
    }
  };

  const handleOrderNow = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const spotlightItem = filteredItems[0];
  const galleryFallback =
    'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=1200';
  const spotlightImage = (spotlightItem as any)?.image || spotlightItem?.imageUrl || galleryFallback;

  return (
    <main>
      {/* Hero Section */}
      <Hero onOrderNow={handleOrderNow} />

      {/* Menu Section */}
      <section id="menu" className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-primary-600 mb-3">
              Chef’s Seasonal Gallery
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900 mb-4">
              Immerse Yourself in Tonight’s Creations
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Curated dishes photographed straight from the pass. Each plate is paired with chef notes so you can feel the
              celebration before it arrives.
            </p>
          </div>

          {/* Spotlight Gallery */}
          <div className="grid gap-8 lg:grid-cols-[1.65fr,1fr] items-stretch mb-12">
            <article
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-neutral-100"
              aria-label="Chef spotlight dish"
            >
              <div className="relative h-80 lg:h-[28rem]">
                <img
                  src={spotlightImage || galleryFallback}
                  alt={spotlightItem?.name || 'Featured dish'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-white/90 rounded-full px-4 py-1 text-sm font-medium text-neutral-700">
                  Chef&apos;s Spotlight
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <h3 className="text-2xl font-serif text-neutral-900">
                    {spotlightItem?.name || 'Awaiting Seasonal Inspiration'}
                  </h3>
                  {spotlightItem?.price && (
                    <span className="text-xl font-semibold text-primary-600">
                      ${Number(spotlightItem.price).toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  {spotlightItem?.description ||
                    'Our culinary team crafted this course to celebrate the warmth of the season—perfect for anniversaries, proposals, or an evening of pure indulgence.'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full border border-primary-200 px-4 py-1 text-sm text-primary-700">
                    Hand-plated to order
                  </span>
                  <span className="inline-flex items-center rounded-full border border-secondary-200 px-4 py-1 text-sm text-secondary-700">
                    Sommelier pairing ready
                  </span>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleOrderNow}
                    className="inline-flex items-center justify-center rounded-full bg-primary-600 text-white px-6 py-3 font-semibold hover:bg-primary-700 transition-colors"
                  >
                    View Full Gallery
                  </button>
                  <Link
                    to="/customer/reservations"
                    className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3 font-medium text-neutral-800 hover:border-neutral-500 transition-colors"
                  >
                    Reserve Chef’s Table
                  </Link>
                </div>
              </div>
            </article>
            <aside className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-neutral-400 mb-4">Hospitality Notes</p>
                <h3 className="font-serif text-2xl text-neutral-900 mb-3">You bring the moment, we set the stage.</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Planning a romantic surprise or celebrating a milestone like Anna’s anniversary? Add structured notes during
                  checkout and our maître d’ will prepare floral touches, pairing suggestions, and toast-worthy desserts.
                </p>
              </div>
              <div className="mt-6 space-y-2 text-sm text-neutral-600">
                <p>• Complimentary concierge call for celebration reservations</p>
                <p>• Live kitchen updates show when your dish is plated</p>
                <p>• Dietary rituals handled discreetly by the chef&apos;s team</p>
              </div>
            </aside>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={(categories || []).map((cat) => ({
              id: cat,
              name: cat,
              description: '',
              displayOrder: 1,
              isActive: true,
              itemCount: 0,
            }))}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          {/* Backend Connection Status */}
          <div className="mt-6 space-y-3">
            {isBackendConnected && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center text-sm">
                🟢 Connected to our live kitchen servers
              </div>
            )}

            {error && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-center text-sm">
                ⚠️ Temporarily showcasing mock dishes: {error}
              </div>
            )}
          </div>

          {/* Menu Grid */}
          <div className="mt-10">
            <MenuGrid
              items={filteredItems}
              onAddToCart={onAddToCart}
              onFavorite={onFavorite}
              favoritedItems={favoritedItems}
              loading={loading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};