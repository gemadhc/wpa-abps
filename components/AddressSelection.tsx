'use client';

import { useState, useEffect} from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { changeDefaultAddress, createAddress} from "../actions/session.js"
import NewAddress from "./NewAddress"

export default function AddressSelection({addresses = [], reload}) {
  const [isOpen, setIsOpen] = useState(false);
  const [finalAddress, setFinalAddress] = useState(null)
  useEffect(()=>{
    let isFinal = addresses.find( (elm) => elm.isDefault == true )
    setFinalAddress(isFinal)

  }, [addresses])

  // Empty handler functions
  const handleAddressChange = (addressId: number) => {
    changeDefaultAddress(addressId).then((data,err) =>{
      reload()
    })
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNew = (obj)=>{
    createAddress(obj).then((data, err) =>{
      reload()
      setIsOpen(false);
    })
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200  ">
      {/* Current Address */}
      <div className="text-gray-700 mb-3">
        <h2 className="text-sm font-semibold text-gray-800">Current Destination Address</h2>
        {
          finalAddress ?
            <p className="text-sm text-gray-600 mt-1">
              {finalAddress.label} <br/>
              {finalAddress.street} <br/>
              {finalAddress.city}, {finalAddress.state} {finalAddress.zipcode}
            </p>
          :
            <></>
        }
        
        
      </div>

      {/* Change Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        Change
      </button>

      {/* Address Selection Dialog */}
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

        {/* Dialog panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4 pt-50 overflow-y-scroll">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-sm w-full p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <Dialog.Title className="text-base font-semibold text-gray-800">
                Select Address
              </Dialog.Title>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address List */}
            <ul className="divide-y divide-gray-200">
              { addresses.map((address) => (
                <li
                  key={address.id}
                  className="py-2 cursor-pointer text-sm text-gray-700 hover:bg-blue-50 px-2 rounded"
                  onClick={() => handleAddressChange(address.id)}
                >
                  <strong> {address.label} </strong> <br/> 
                  {address.street} {address.city} {address.state} {address.zipcode}
                  
                </li>
              ))}
            </ul>
            <br/> <br/>
            <NewAddress 
              handleNew = {handleNew}
            />
      
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
