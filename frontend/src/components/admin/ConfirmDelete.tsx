// src/components/admin/ConfirmDelete.tsx
import React from 'react';

type Props = {
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmDelete: React.FC<Props> = ({ itemName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete <span className="font-semibold">{itemName}</span>?</p>
            <div className="flex justify-end gap-2 mt-4">
                <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
        </div>
    </div>
);

export default ConfirmDelete;