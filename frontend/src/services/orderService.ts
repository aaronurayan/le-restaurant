import axios from "axios"; 


export const placeOrder = (orderData: any) => {
  return axios.post("/api/orders", orderData);
};

export const getOrderStatus = (orderId: number) => {
  return axios.get(`/api/orders/${orderId}`);
};

export const getOrderHistory = (customerId: number) => {
  return axios.get(`/api/orders/user/${customerId}`);
};
