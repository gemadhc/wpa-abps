'use client';

import { useState } from 'react';
import { Pencil, Trash2, Save } from 'lucide-react';

export default function LineItems() {
  const [items, setItems] = useState([
    { id: 1, item: 'Backflow Test', description: 'Testing service', qty: 1, unitPrice: 85, taxable: true },
    { id: 2, item: 'Replacement Part', description: 'Valve replacement', qty: 2, unitPrice: 15, taxable: false },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<any>({});

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditedItem({ ...item });
  };

  const handleSave = (id: number) => {
    setItems((prev) =>
      prev.map((itm) => (itm.id === id ? editedItem : itm))
    );
    setEditingId(null);
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((itm) => itm.id !== id));
  };

  const handleChange = (field: string, value: any) => {
    setEditedItem((prev: any) => ({ ...prev, [field]: value }));
  };

  const total = items.reduce((sum, itm) => sum + itm.qty * itm.unitPrice, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs border-b">
              <th className="py-2 px-3">Item</th>
              <th className="py-2 px-3">Description</th>
              <th className="py-2 px-3 text-right">Qty</th>
              <th className="py-2 px-3 text-right">Unit Price</th>
              <th className="py-2 px-3 text-center">Taxable</th>
              <th className="py-2 px-3 text-right">Amount</th>
              <th className="py-2 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((itm) => {
              const isEditing = itm.id === editingId;
              const amount = (itm.qty * itm.unitPrice).toFixed(2);
              return (
                <tr key={itm.id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-2 px-3">
                    {isEditing ? (
                      <input
                        value={editedItem.item}
                        onChange={(e) => handleChange('item', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    ) : (
                      itm.item
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {isEditing ? (
                      <input
                        value={editedItem.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    ) : (
                      itm.description
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedItem.qty}
                        onChange={(e) => handleChange('qty', +e.target.value)}
                        className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm text-right"
                      />
                    ) : (
                      itm.qty
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedItem.unitPrice}
                        onChange={(e) => handleChange('unitPrice', +e.target.value)}
                        className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm text-right"
                      />
                    ) : (
                      `$${itm.unitPrice.toFixed(2)}`
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editedItem.taxable}
                        onChange={(e) => handleChange('taxable', e.target.checked)}
                        className="w-4 h-4 accent-blue-600"
                      />
                    ) : itm.taxable ? 'Yes' : 'No'}
                  </td>
                  <td className="py-2 px-3 text-right font-medium">${amount}</td>
                  <td className="py-2 px-3 text-center">
                    {isEditing ? (
                      <button onClick={() => handleSave(itm.id)} className="p-1 text-green-600 hover:bg-green-50 rounded-lg">
                        <Save className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => handleEdit(itm)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(itm.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {items.map((itm) => {
          const isEditing = itm.id === editingId;
          const amount = (itm.qty * itm.unitPrice).toFixed(2);

          return (
            <div key={itm.id} className="p-4 flex flex-col gap-2 bg-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{itm.item}</span>
                <div className="flex gap-2">
                  {isEditing ? (
                    <button onClick={() => handleSave(itm.id)} className="p-1 text-green-600 hover:bg-green-50 rounded-lg">
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => handleEdit(itm)} className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(itm.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                {isEditing ? (
                  <input
                    value={editedItem.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
                  />
                ) : (
                  itm.description
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-4 text-sm mt-2">
                <div>
                  <span className="text-gray-500">Qty:</span>{' '}
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedItem.qty}
                      onChange={(e) => handleChange('qty', +e.target.value)}
                      className="w-16 border border-gray-300 rounded-md px-1 py-1 text-sm ml-1"
                    />
                  ) : (
                    itm.qty
                  )}
                </div>
                <div className="text-right">
                  <span className="text-gray-500">Unit:</span>{' '}
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedItem.unitPrice}
                      onChange={(e) => handleChange('unitPrice', +e.target.value)}
                      className="w-20 border border-gray-300 rounded-md px-1 py-1 text-sm text-right ml-1"
                    />
                  ) : (
                    `$${itm.unitPrice.toFixed(2)}`
                  )}
                </div>
                <div>
                  <span className="text-gray-500">Taxable:</span>{' '}
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editedItem.taxable}
                      onChange={(e) => handleChange('taxable', e.target.checked)}
                      className="w-4 h-4 accent-blue-600 ml-1"
                    />
                  ) : itm.taxable ? (
                    'Yes'
                  ) : (
                    'No'
                  )}
                </div>
                <div className="text-right font-medium text-gray-800">
                  <span className="text-gray-500">Amount:</span> ${amount}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between md:justify-end items-center px-4 py-3 bg-gray-50 border-t rounded-b-2xl">
        <div className="text-sm font-semibold text-gray-700">
          Total: ${total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
