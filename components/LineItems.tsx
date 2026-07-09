'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, Save, PlusCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { createItem, removeItem, updateItem } from "../actions/invoice"
import { getQuickbooksItems } from "../actions/quickbooks.js"
import { X, CheckCircle2 } from 'lucide-react';
import { removeLineItem, createLineItem, updateLineItem} from "@/lib/lineitem_db"
import { syncLineItems } from "@/lib/sync"
import { Dialog, Menu, Transition } from '@headlessui/react';

function EditForm({
  lineItem,
  invoiceID, 
  reloadItems, 
  onClose
}) {

  
  const [itemOptions, setItemOptions] = useState([]);
  const [message, setMessage] = useState(null)
  const [formData, setFormData] = useState({
    description: "",
    quantity: 1,
    unitPriceDefined: 0.01,
    taxable: false,
    notes: "",
    qb_id: "",
    item: "",
  });
  useEffect(() => {
    getQuickbooksItems().then((data) => {
      setItemOptions(data || []);
    });
  }, []);


  useEffect(() => {
    if (!lineItem) return;

    setFormData({
        ...lineItem,
        description: lineItem.description || "",
        quantity: Number(lineItem.quantity ?? 0.5),
        unitPriceDefined: Number(lineItem.unitPriceDefined ?? 0.01) ,
        taxable: lineItem.taxable || false,
        notes: lineItem.notes || "",
        qb_id: lineItem.qb_id || "",
        item: lineItem.item || "",
      });
  }, [lineItem]);

  const handleChange = (e) => {
    console.log("Changing this target: ", e.target)
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      let updated;

      if (type === "checkbox") {
        updated = {
          ...prev,
          [name]: checked,
        };
      } else if (name == "quantity" || name == "unitPriceDefined") {
        if(value == 0 ){
          updated = {
            ...prev,
            [name]: '',
         };
        }else{
          updated = {
            ...prev,
            [name]: value,
          };
        }
      } else {
        updated = {
          ...prev,
          [name]: String(value).replace(/^0+(?!$)/, ""),
        };
      }

      if (name === "qb_id") {
        const selected = itemOptions.find(opt => opt.Id === value);
        if (selected) {
          updated.qb_id = selected.Id;
          updated.item = selected.Description;
          updated.description = selected.Name;
          updated.unitPriceDefined = Number(selected.UnitPrice ?? 0);
          updated.amount = selected.UnitPrice * updated.quantity; 
        }
      }


      updated.amount =
        (updated.quantity) *
        (updated.unitPriceDefined);

      return updated;
    });
  };

  const [saving, setSaving] = useState(false);

  const validate = ()=>{
    setMessage(null)
    if(formData.quantity == '' || formData.quantity == 0 ){
      return false
    }
    if( formData.unitPriceDefined == 0 || formData.unitPriceDefined == ''){
      return false
    }
    return true; 

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validate() ){
      setMessage("Quantity and Unit Price missing")
      return
    }

    setSaving(true);

    await updateLineItem(invoiceID, formData);
    await syncLineItems();

    await reloadItems();

    setSaving(false);

    onClose();
  };

  const total = (formData.quantity * formData.unitPriceDefined).toFixed(2);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-10 min-w-100">
      {
        message ? 
          <div className = 'bg-amber-100 p-3 rounded text-black'>
            {message}
          </div>
        :   
        <> </>
      }
         
      <div>
        <label className="block text-sm font-medium mb-1">Item</label>
        <select
          name="qb_id"
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full mt-2"
          value = { formData.qb_id}
        >
          <option value="">Select an item</option>
          {itemOptions.map(opt => (
            <option key={opt.Id} value={opt.Id}>
              {opt.Name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full mt-2"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            min={1}
            step={0.5}
            value={formData.quantity}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full mt-2"
          />

        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Unit Price
          </label>
          <input
            type="number"
            name="unitPriceDefined"
            min="0.01"
            step="0.01"
            value={formData.unitPriceDefined}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full mt-2"
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
      <div className="bg-gray-100 rounded p-3">
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t border-t-gray-300">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-slate-600 text-white rounded-xl disabled:bg-gray-300"
      >
          {saving ? "Saving..." : "Save Changes"}
      </button>
      </div>
    </form>
  );
}


export default function LineItems({ items: initialItems = [], invoiceID, reloadItems }) {
  const [items, setItems] = useState(initialItems);
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setItems(initialItems);  }, [initialItems]);
  
  const handleEdit = (item) => {
      setSelectedItem(item);
      setOpenEditDialog(true);
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
        <div className="fixed inset-0 bg-black/60" />

        <div className="fixed inset-0 flex items-center justify-center sm:p-4 text-black px-10 ">
          <Dialog.Panel className="bg-white max-w-200 min-h-100 sm:min-h-0 rounded-xl sm:rounded-2xl pb-10 ">
            <div className="flex justify-between items-center mb-3 h-20 px-5 shadow">
              <Dialog.Title className="font-semibold text-lg">
                Edit Item
              </Dialog.Title>
              <button onClick={() => setOpenEditDialog(false)}>
                <X className="w-10 h-10 text-gray-500 border rounded-xl " />
              </button>
            </div>
            <EditForm
              lineItem={selectedItem}
              invoiceID={invoiceID}
              reloadItems={reloadItems}
              onClose={() => {
                  setOpenEditDialog(false);
                  setSelectedItem(null);
              }}
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
          
                  const isRemoving = removingId === itm.id;

                  const currentAmount = itm.quantity * itm.unitPriceDefined;

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
                            disabled = {  isRemoving }
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
