import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DeliveryTracking as DeliveryTrackingComponent } from '../components/organisms/DeliveryTracking';
import { Button } from '../components/atoms/Button';
import { ArrowLeft, Package } from 'lucide-react';

const DeliveryTracking: React.FC = () => {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const [isValidDelivery, setIsValidDelivery] = useState<boolean | null>(null);

  useEffect(() => {
    // In a real app, you would validate the delivery ID here
    if (deliveryId) {
      setIsValidDelivery(true);
    } else {
      setIsValidDelivery(false);
    }
  }, [deliveryId]);

  const handleBack = () => {
    navigate('/delivery');
  };

  if (isValidDelivery === null) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading delivery tracking...</p>
        </div>
      </div>
    );
  }

  if (isValidDelivery === false) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Delivery Not Found</h1>
          <p className="text-neutral-600 mb-6">
            The delivery you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Delivery Management
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DeliveryTrackingComponent
          deliveryId={deliveryId!}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};

export default DeliveryTracking;
