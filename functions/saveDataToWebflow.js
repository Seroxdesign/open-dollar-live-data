import dotevn from 'dotenv';
dotevn.config();
// Set your Webflow API key
const apiKey = process.env.WEBFLOW_API_KEY;

const live_data_collection_id = process.env.LIVE_DATA_COLLECTION_ID;
const arbitrum_item_id = process.env.ARBITRUM_ITEM_ID;

export const saveDataToWebflow = async ({ collateral, circulatingSupply, vaults }) => {
  console.log('Saving data to Webflow', collateral, circulatingSupply, vaults, live_data_collection_id, arbitrum_item_id);
  if (!collateral || !circulatingSupply || !vaults) {
    console.log('Missing data');
    return;
  }
  const options = {
    method: 'PATCH',
    headers: {accept: 'application/json', 'content-type': 'application/json', 'Authorization': `Bearer ${apiKey}`,},
    body: JSON.stringify({isArchived: false, isDraft: false, fieldData: {
      name: 'arbitrum-data',
      slug: 'arbitrum-data',
      "number-of-vaults": `${vaults}`,
      "circulating-supply": `${circulatingSupply}`,
      "collateral-locked": `${collateral}`
    }})
  };
  const res = await fetch(`https://api.webflow.com/v2/collections/${live_data_collection_id}/items/${arbitrum_item_id}/live`, options)
    .then(response => response.json())
    .then(response => {
      console.log('Response', response);
      return response
    })
    .catch(err => console.error(err));
  fetch(`https://api.webflow.com/v2/collections/${live_data_collection_id}/items/publish`, { 
    method: 'POST',
    headers: {accept: 'application/json', 'content-type': 'application/json', 'Authorization': `Bearer ${apiKey}`,},
    body: JSON.stringify({ 
      itemIds: [
        res.id,
      ],
    }),
  }).then(response => response.json()).then(response => console.log(response)).catch(err => console.error(err, vaults, circulatingSupply, collateral));
}