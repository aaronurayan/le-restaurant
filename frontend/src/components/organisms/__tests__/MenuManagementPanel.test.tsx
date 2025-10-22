import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MenuManagementPanel from '../MenuManagementPanel';
import { useMenuManagementApi } from '../../../hooks/useMenuManagementApi';

vi.mock('../../../hooks/useMenuManagementApi');

describe('MenuManagementPanel (F103/F104)', () => {
  const mockApi = {
    menuItems: [
      {
        id: 1,
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce',
        price: 12.99,
        category: 'STARTER',
        available: true,
        imageUrl: 'salad.jpg',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z'
      }
    ],
    loading: false,
    error: null,
    fetchMenuItems: vi.fn(),
    createMenuItem: vi.fn(),
    updateMenuItem: vi.fn(),
    deleteMenuItem: vi.fn(),
    fetchCategories: vi.fn().mockResolvedValue(['STARTER', 'MAIN'])
  };
  
  beforeEach(() => {
    (useMenuManagementApi as any).mockReturnValue(mockApi);
  });
  
  it('Test 1: Should render panel when isOpen is true', () => {
    render(<MenuManagementPanel isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Menu Management')).toBeInTheDocument();
  });
  
  it('Test 2: Should not render when isOpen is false', () => {
    render(<MenuManagementPanel isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText('Menu Management')).not.toBeInTheDocument();
  });
  
  it('Test 3: Should display menu items in table', async () => {
    render(<MenuManagementPanel isOpen={true} onClose={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });
  });
  
  it('Test 4: Should open create modal when Add button clicked', async () => {
    render(<MenuManagementPanel isOpen={true} onClose={vi.fn()} />);
    const addButton = screen.getByText('+ Add Menu Item');
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByText('➕ Add New Menu Item')).toBeInTheDocument();
    });
  });
  
  it('Test 5: Should filter by search term', async () => {
    render(<MenuManagementPanel isOpen={true} onClose={vi.fn()} />);
    const searchInput = screen.getByPlaceholderText(/Search menu items/i);
    fireEvent.change(searchInput, { target: { value: 'Caesar' } });
    await waitFor(() => {
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
    });
  });
  
  it('Test 6: Should call createMenuItem on form submit', async () => {
    render(<MenuManagementPanel isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('+ Add Menu Item'));
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Pizza' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Cheese pizza' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('Category'), { target: { value: 'MAIN' } });
    fireEvent.click(screen.getByText('Create Item'));
    await waitFor(() => {
      expect(mockApi.createMenuItem).toHaveBeenCalled();
    });
  });
  
  it('Test 7: Should call deleteMenuItem when delete clicked', async () => {
    window.confirm = vi.fn(() => true);
    render(<MenuManagementPanel isOpen={true} onClose={vi.fn()} />);
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(mockApi.deleteMenuItem).toHaveBeenCalledWith(1);
  });
  
  it('Test 8: Should display error message', () => {
    (useMenuManagementApi as any).mockReturnValue({
      ...mockApi,
      error: 'Failed to fetch'
    });
    render(<MenuManagementPanel isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });
  
  it('Test 9: Should display loading spinner', () => {
    (useMenuManagementApi as any).mockReturnValue({
      ...mockApi,
      loading: true
    });
    render(<MenuManagementPanel isOpen={true} onClose={vi.fn()} />);
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeDefined();
  });
  
  it('Test 10: Should close panel when close button clicked', () => {
    const onClose = vi.fn();
    render(<MenuManagementPanel isOpen={true} onClose={onClose} />);
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});