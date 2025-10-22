import React, { useEffect, useState } from 'react';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { useApi } from '../hooks/useApi';
import { DeliveryManagementPanel } from '../components/organisms/DeliveryManagementPanel';

interface Delivery {
  id: number;
  customerName: string;
  phoneNumber: string;
  address: string;
  orderedItems: string[];
  status: 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
}

const DeliveryManagement: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const { get, post, put, del } = useApi();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    const data = await get('/api/deliveries');
    setDeliveries(data);
  };

  const handleDelete = async (id: number) => {
    await del(`/api/deliveries/${id}`);
    fetchDeliveries();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ul>
          {deliveries.map((delivery) => (
            <li key={delivery.id}>
              <p>{delivery.customerName} - {delivery.status}</p>
              <Button onClick={() => {/* Open modal to edit delivery */ }}>Edit</Button>
              <Button onClick={() => handleDelete(delivery.id)}>Delete</Button>
            </li>
          ))}
        </ul>
        <DeliveryManagementPanel />
      </div>
    </div>
  );
};

export default DeliveryManagement;
