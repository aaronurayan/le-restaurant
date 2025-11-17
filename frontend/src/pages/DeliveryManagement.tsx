import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/atoms/Button';
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

  const statusClasses: Record<Delivery['status'], string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PREPARING: 'bg-blue-100 text-blue-800',
    OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center text-primary-600 hover:text-primary-700 mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          <p className="text-xs uppercase tracking-[0.4em] text-primary-600 mb-2">Route orchestration</p>
          <h1 className="text-3xl font-serif font-bold text-neutral-gray-900">Delivery Management</h1>
          <p className="text-neutral-gray-600 mt-1">
            Monitor courier readiness, update addresses, and resolve issues before guests feel the delay.
          </p>
        </div>
        <div className="grid gap-4 mb-8">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">{delivery.customerName}</h2>
                  <p className="text-sm text-neutral-600">{delivery.address}</p>
                  <p className="text-sm text-neutral-500">☎ {delivery.phoneNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[delivery.status]}`}>
                  {delivery.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 text-sm text-neutral-600">
                {delivery.orderedItems.map((item) => (
                  <span key={item} className="px-3 py-1 rounded-full bg-neutral-100">{item}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-5">
                <Button variant="outline" size="sm">Contact Courier</Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(delivery.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <DeliveryManagementPanel />
      </div>
    </div>
  );
};

export default DeliveryManagement;
