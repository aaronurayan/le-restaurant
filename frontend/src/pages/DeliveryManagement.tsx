import React from 'react';
import { DeliveryManagementPanel } from '../components/organisms/DeliveryManagementPanel';

const DeliveryManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DeliveryManagementPanel />
      </div>
    </div>
  );
};

export default DeliveryManagement;
