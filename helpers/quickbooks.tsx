export  const getLine = (lineItems) => {
    return lineItems
      .filter((item) => item.qb_id)
      .map((item) => {
        const quantity = parseFloat(item.quantity || 0);
        const unitPrice = parseFloat(item.unitPriceDefined || 0);
        const amount = quantity * unitPrice;
        return {
          Amount: amount,
          DetailType: 'SalesItemLineDetail',
          Description: item.description || 'Item',
          SalesItemLineDetail: {
            /*ItemRef: { value: item.qb_id.toString() },*/
            Qty: quantity,
            UnitPrice: unitPrice,
            TaxCodeRef: item.taxable ? { value: 'TAX' } : { value: 'NON' },
          },
        };
      });
  };

export const cutomerReference = ( customer) =>{
  return(
    { value: 1165 }
  )
}

 export const formatAddress = (source) => {
    if (!source || !source.street) return undefined;
    return {
      Line1: source.street || '',
      Line2: source.care_of || '',
      City: source.city || '',
      CountrySubDivisionCode: source.state || '',
      PostalCode: source.zipcode || '',
    };
  };

  export const getCustomFields = (invoice, address, billing) => [
    {
      DefinitionId: '1',
      Name: 'P.O. Number',
      Type: 'StringType',
      StringValue: invoice.purchase_order || '',
    },
    {
      DefinitionId: '2',
      Name: 'Sales Tax Code',
      Type: 'StringType',
      StringValue: address.sales_tax || '',
    },
    {
      DefinitionId: '3',
      Name: 'Phone Number',
      Type: 'StringType',
      StringValue: billing.phone || '',
    },
  ];

  export const getTxnDate = () => new Date().toISOString().split('T')[0];





  