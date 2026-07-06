'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Save, PlusCircle } from 'lucide-react';
import { createItem, removeItem, updateItem } from "../actions/invoice"
import { getQuickbooksItems } from "../actions/quickbooks.js"
import { X, CheckCircle2 } from 'lucide-react';

import { removeLineItem, createLineItem, updateLineItem} from "@/lib/lineitem_db"
import { syncLineItems } from "@/lib/sync"

import { Dialog, Menu, Transition } from '@headlessui/react';


function EditForm({
  lineItem,
  onSave,
  onCancel,
}) {
  const [itemOptions, setItemOptions] = useState([]);
  const [formData, setFormData] = useState({
    description: lineItem.description || "",
    quantity: lineItem.quantity || 1,
    unitPrice: lineItem.unitPrice || 0,
    taxable: lineItem.taxable || false,
    notes: lineItem.notes || "",
  });

  useEffect(() => {
    getQuickbooksItems().then((data) => {
      setItemOptions(data || []);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const total = (formData.quantity * formData.unitPrice).toFixed(2);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-10">
      <div>
        <select
          className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full mt-2"
        >
          <option value="">Select an item</option>
          {itemOptions.map(opt => (
            <option key={opt.Id} value={opt.Id}>
              {opt.Name}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            min="0"
            step="1"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Unit Price
          </label>
          <input
            type="number"
            name="unitPrice"
            min="0"
            step="0.01"
            value={formData.unitPrice}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="taxable"
            checked={formData.taxable}
            onChange={handleChange}
          />
          Taxable
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="bg-gray-100 rounded p-3">
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}


export default function LineItems({ items: initialItems = [], invoiceID, reloadItems }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [editedItem, setEditedItem] = useState<any>({});
  const [itemOptions, setItemOptions] = useState([]);
  const [creating, setCreating] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [saving, setSaving] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)

  useEffect(() => {
    getQuickbooksItems().then((data) => {
      setItemOptions(data || []);
    });
  }, []);

  useEffect(() => {
    setItems(initialItems);  }, [initialItems]);

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditedItem(item);
    setOpenEditDialog(true)
  };

  const handleSave = async(id: number) => {
    setSaving(true)

    await updateLineItem(invoiceID, editedItem)
    await syncLineItems(); 

    reloadItems();
    setEditingId(null);
    setEditedItem({});
    setSaving(false)

  };

  const handleRemove = async (id: number) => {
    setRemovingId(id)
    setRemoving(true)

    await removeLineItem(id, invoiceID)
    await syncLineItems()

    reloadItems();
    setRemovingId(null)
    setRemoving(false)

  };

  const handleChange = (field: string, value: any) => {
    setEditedItem((prev: any) => {
      let  updated; 
      if( field === "taxable"){
        updated = { ...prev, [field]: value };

      }else{
        updated = { ...prev, [field]: String(value).replace(/^0+(?!$)/, "") };
      }
      

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

  const handleAddNewItem = async () => {
    setCreating(true)
    await createLineItem(invoiceID)
    await syncLineItems()
    reloadItems();
    setCreating(false)

  };



  const total = items.reduce((sum, itm) => {
    if (itm.action === "REMOVE") return sum;

    return sum + itm.quantity * itm.unitPriceDefined;
  }, 0);
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        className="relative z-50"
      >
         <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center sm:p-4 text-black">
          <Dialog.Panel className="bg-white w-full sm:max-w-md min-h-screen sm:min-h-0 rounded-none sm:rounded-2xl ">
            <div className="flex justify-between items-center mb-3 h-20 w-full px-5 shadow">
              <Dialog.Title className="font-semibold text-lg">
                Process Payment
              </Dialog.Title>
              <button onClick={() => setOpenEditDialog(false)}>
                <X className="w-10 h-10 text-gray-500 border rounded-xl " />
              </button>
            </div>
            <EditForm 
              lineItem = {editedItem}
              onSave = { () => console.log("saving ..." )} 
              onCancel = { ()=> console.log( "canceling")}
            />
          </Dialog.Panel>
        </div>
        
      </Dialog>
      <div className="divide-y divide-gray-100">
        {
          items.length ? 
            <> 
              {
                items.map((itm) => {
                  const isEditing = itm.id === editingId;
                  const isRemoving = removingId === itm.id;

                  const currentAmount = isEditing
                    ? (editedItem.quantity || 0) * (editedItem.unitPriceDefined || 0)
                    : itm?.quantity * itm?.unitPriceDefined;

                  if( itm?.action == "REMOVE" ){
                    return(
                      <> </>
                    )
                  }

                  return (
                    <div key={itm.id} className="p-4 py-10 flex flex-col gap-2  mb-5">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">{itm.item}</span>
                        <div className="flex gap-2">
                          
                            <button
                              onClick={() => handleEdit(itm)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Pencil className="w-6 h-6" />
                            </button>
                        
                          <button
                            disabled = { saving || isRemoving }
                            onClick={() => handleRemove(itm.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-800"
                          >
                            {
                              isRemoving ? 
                                <> Removing ... </>
                              : 
                                <Trash2 className="w-6 h-6" />
                            }
                          </button>
                        </div>
                      </div>
                
                      <div className="text-sm text-gray-600">
                          {itm.description}
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 text-sm mt-2">
                            Quantity: {itm.quantity} <br/>
                            Unit Price: {`$${Number(itm.unitPriceDefined).toFixed(2)}`} <br/>
                            Line Total: {`$${currentAmount.toFixed(2)}`}
                      </div>
                    </div>
                  );
                })}
            </>
          : 
            <div className ="py-5 px-5">  
              No items to show
            </div>
        }



        
      </div>

      <div className="flex justify-between md:justify-end items-center px-4 py-3 bg-gray-50 border-t rounded-b-2xl">
        <button
          disabled = { creating } 
          onClick={handleAddNewItem}
          className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          <PlusCircle className="w-4 h-4" />
          {
            creating ? 
              <> Loading... </> 
            : 
              <> Add New Line Item </>
          } 
          
        </button>

        <div className="text-sm font-semibold text-gray-700">
          Total: ${total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
