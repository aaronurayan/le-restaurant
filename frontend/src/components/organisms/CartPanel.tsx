import React, { useState } from 'react';
import { CartItem, CreateOrderRequest } from '../../types/order';
import { MenuItem } from '../../types';

interface CartPanelProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onCreateOrder: (orderData: CreateOrderRequest) => void;
  currentUserId: number;
}

const CartPanel: React.FC<CartPanelProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCreateOrder,
  currentUserId
}) => {
  const [specialInstructions, setSpecialInstructions] = useState('');

  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleCreateOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    const orderData: CreateOrderRequest = {
      userId: currentUserId,
      orderItems: cartItems.map(item => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions
      })),
      specialInstructions
    };

    onCreateOrder(orderData);
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">장바구니</h2>
        <p className="text-gray-600 text-center py-8">장바구니가 비어있습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">장바구니</h2>
      
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.menuItemName}</h3>
              <p className="text-sm text-gray-600">
                ₩{item.unitPrice.toLocaleString()} × {item.quantity}
              </p>
              {item.specialInstructions && (
                <p className="text-sm text-gray-500 italic">
                  요청사항: {item.specialInstructions}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-3 py-1 border-x border-gray-300">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              
              <span className="font-medium text-gray-900 min-w-[80px] text-right">
                ₩{item.subtotal.toLocaleString()}
              </span>
              
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-900">총 금액:</span>
          <span className="text-2xl font-bold text-blue-600">
            ₩{totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전체 요청사항
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="전체 주문에 대한 요청사항을 입력하세요..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <button
          onClick={handleCreateOrder}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          주문하기
        </button>
      </div>
    </div>
  );
};

export default CartPanel;
