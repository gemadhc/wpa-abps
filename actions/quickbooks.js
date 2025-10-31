const server = process.env.SERVER;
const office = process.env.OFFICE;
const quickbooks = process.env.QUICKBOOKS;
const token_server = process.env.TOKEN_SERVER;

const items = () => 
	fetch(`${quickbooks}/items`, {
    	method: "GET",
    	credentials: "include"
 });

const token = (card) =>
  fetch(`${token_server}`, {
    method: "POST",
    body: JSON.stringify(card),
    headers: {
      "Content-Type": "application/json",
    },
  });

const charge = (chargeBodyWithToken) =>
  fetch(`${quickbooks}/charge/create`, {
    method: "POST",
    body: JSON.stringify(chargeBodyWithToken),
    headers: {
      "Content-Type": "application/json",
      "request-Id": "4546"
    },
  });

const sendReceipt = (id, email) =>
  fetch(`${quickbooks}/salesreceipt/send`, {
    method: "POST",
    body: JSON.stringify({ salesID: id, email }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "request-Id": "1234", // Optional — can be generated dynamically if needed
    },
  });

const flagAsAdded = (docNumber, quickbooksID, invoiceID, type) => {
  console.log("Flagging as added:", docNumber, quickbooksID, invoiceID, type);
  return fetch(`${office}/invoices/inQuickbooks`, {
    method: "POST",
    body: JSON.stringify({
      docNum: docNumber,
      quickbooksID: quickbooksID,
      invoiceID: invoiceID,
      type: type
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export async function createToken(card) {
	const mycard = {
	  card: {
	    name: card.cardName,
	    number: card.cardNumber.replace(/\s/g, ''),
	    expMonth: card.expiryMonth,
	    expYear: card.expiryYear,
	    cvc: card.cvv
	  }
	};
  const res = await token(mycard);

  if (!res.ok) {
    const message = await extractError(await res.json(), "Card tokenization failed");
    throw new Error(message);
  }
  return await res.json();
}

export async function createCharge(chargeBodyWithToken) {
  const res = await charge(chargeBodyWithToken);
  if (!res.ok) throw new Error("Failed to create charge");
  const data = await res.json();
  return JSON.parse(data).response;
}

export async function createSalesReceipt(salesBody, invoiceID) {
  console.log("creating sales: ", salesBody, invoiceID)
  const res = await salesReceipt(salesBody);
  if (!res.ok) throw new Error("Failed to create sales receipt");
  const data = await res.json(); 
  if(JSON.parse(data).response.SalesReceipt){
    const myres = JSON.parse(data).response.SalesReceipt
    const res2 = await flagAsAdded(myres.DocNumber, myres.Id, invoiceID, "SALES RECEIPT")
    const data2 = await res2.json()
    return JSON.parse(data).response.SalesReceipt;
  }else{
     return JSON.parse(data).response;
  }
}

export const getQuickbooksItems = async () => {
	try {
	    const response = await items();
	    const data = await response.json();
	    if (!response.ok) {
	      throw new Error(data.message || "Failed to update stop");
	    }
	    return JSON.parse(data).response.Item
	} catch (err) {
	    // Always throw error so createAsyncThunk or calling code can catch it
	    throw err;
	} 
}

export const processCash = () => {}
export const processCheck = () =>{}