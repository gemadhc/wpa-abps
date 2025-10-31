'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Save, PlusCircle } from 'lucide-react';
import { createItem, removeItem, updateItem } from "../actions/invoice"
import { getQuickbooksItems } from "../actions/quickbooks.js"

export default function LineItems({ items: initialItems = [], invoiceID, reloadItems }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<any>({});
  const [itemOptions, setItemOptions] = useState([]);

  useEffect(() => {
    getQuickbooksItems().then((data) => {
      setItemOptions(data || []);
    });
  }, []);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditedItem(item);
  };

  const handleSave = (id: number) => {
    updateItem(editedItem.id, editedItem).then(() => {
      reloadItems();
      setEditingId(null);
      setEditedItem({});
    });
  };

  const handleRemove = (id: number) => {
    removeItem(id).then(() => {
      reloadItems();
    });
  };

  const handleChange = (field: string, value: any) => {
    setEditedItem((prev: any) => {
      const updated = { ...prev, [field]: value };

      // === Auto-update unit price & amount ===
      if (field === 'qb_id') {
        const selected = itemOptions.find(opt => opt.Id === value);
        if (selected) {
          updated.unitPriceDefined = selected.UnitPrice || 0;
          updated.item = selected.Name;
        }
      }

      if (field === 'quantity' || field === 'unitPriceDefined' || field === 'qb_id') {
        updated.amount = (updated.quantity || 0) * (updated.unitPriceDefined || 0);
      }

      return updated;
    });
  };

  const handleAddNewItem = () => {
    createItem(invoiceID).then(() => {
      reloadItems();
    });
  };

  const total = items.reduce( (sum, itm) => sum + itm.quantity * itm.unitPriceDefined, 0 );



  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {items.map((itm) => {
          const isEditing = itm.id === editingId;
          const currentAmount = isEditing
            ? (editedItem.quantity || 0) * (editedItem.unitPriceDefined || 0)
            : itm.quantity * itm.unitPriceDefined;

          return (
            <div key={itm.id} className="p-4 flex flex-col gap-2 bg-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{itm.item}</span>
                <div className="flex gap-2">
                  {isEditing ? (
                    <button
                      onClick={() => handleSave(itm.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(itm)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
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

              {/* ITEM SELECT */}
              {isEditing && (
                <select
                  value={editedItem.qb_id || ''}
                  onChange={(e) => handleChange('qb_id', e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full mt-2"
                >
                  <option value="">Select an item</option>
                  {itemOptions.map(opt => (
                    <option key={opt.Id} value={opt.Id}>
                      {opt.Name}
                    </option>
                  ))}
                </select>
              )}

              <div className="text-sm text-gray-600">
                {isEditing ? (
                  <input
                    value={editedItem.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm mt-1"
                    placeholder="Description"
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
                      value={editedItem.quantity}
                      onChange={(e) => handleChange('quantity', +e.target.value)}
                      className="w-16 border border-gray-300 rounded-md px-1 py-1 text-sm ml-1"
                    />
                  ) : (
                    itm.quantity
                  )}
                </div>
                <div className="text-right">
                  <span className="text-gray-500">Unit:</span>{' '}
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedItem.unitPriceDefined}
                      onChange={(e) => handleChange('unitPriceDefined', +e.target.value)}
                      className="w-20 border border-gray-300 rounded-md px-1 py-1 text-sm text-right ml-1"
                    />
                  ) : (
                    `$${itm.unitPriceDefined.toFixed(2)}`
                  )}
                </div>
                <div>
                  <span className="text-gray-500">Taxable:</span>{' '}
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={!!editedItem.taxable}
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
                  <span className="text-gray-500">Amount:</span> ${currentAmount.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between md:justify-end items-center px-4 py-3 bg-gray-50 border-t rounded-b-2xl">
        <button
          onClick={handleAddNewItem}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
        >
          <PlusCircle className="w-4 h-4" /> Add New Line Item
        </button>
        <div className="text-sm font-semibold text-gray-700">
          Total: ${total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
