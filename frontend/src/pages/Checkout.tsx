import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CheckoutForm from '../components/organisms/CheckoutForm';

/**
 * Checkout Page (F105)
 * 
 * Customer checkout page for reviewing cart items and placing orders.
 * Integrates with F104 (Menu/Cart) and F106 (Payment Management).
 * 
 * User Flow: Menu → Cart → Checkout → Payment
 */

const wizardSteps = [
  { label: 'Guest Details', description: 'Introduce your party and delivery preference.' },
  { label: 'AI Pairing', description: 'Let our sommelier suggest wines or desserts.' },
  { label: 'Payment', description: 'Confirm experience and secure the order.' },
];

export const Checkout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="bg-neutral-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Menu</span>
        </button>

        <div className="grid gap-10 lg:grid-cols-[1.25fr,1fr]">
          <section>
            <p className="text-xs uppercase tracking-[0.4em] text-primary-600 mb-3">Curated Journey</p>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-900 mb-4">
              Let’s finalize your experience
            </h1>
            <p className="text-neutral-600 mb-6">
              Complete each step at your pace. Add celebration notes, preview AI pairings, and confirm payment with confidence.
            </p>
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 mb-8">
              <ol className="space-y-5">
                {wizardSteps.map((step, index) => (
                  <li key={step.label} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-600 text-white font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">{step.label}</p>
                      <p className="text-neutral-800 font-medium">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <CheckoutForm className="bg-white rounded-3xl shadow-lg border border-neutral-100 p-6" />
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400 mb-2">AI Sommelier</p>
              <h2 className="text-2xl font-serif text-neutral-900 mb-3">Pairings for tonight</h2>
              <p className="text-sm text-neutral-600 mb-4">
                Add chef-recommended wines, dessert flights, or celebratory touches. These can be toggled in step 2.
              </p>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>• Blanc de Blancs half bottle for truffle pasta</li>
                <li>• Chocolate soufflé sharing portion</li>
                <li>• Anniversary floral arrangement on arrival</li>
              </ul>
            </div>
            <div className="bg-primary-600 text-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Need concierge help?</h3>
              <p className="text-sm text-primary-50 mb-4">
                Call us before completing payment and we’ll coordinate seating, dietary notes, or driver instructions.
              </p>
              <button
                type="button"
                className="inline-flex items-center justify-center w-full rounded-full bg-white text-primary-700 font-semibold px-4 py-2"
                onClick={() => window.open('tel:+11234567890')}
              >
                +1 (123) 456-7890
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};