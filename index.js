import { saveDataToWebflow } from './functions/saveDataToWebflow.js';
import { getLiveProtocolData } from './functions/getLiveProtocolData.js';

const openDollarCronJob = async (req, res) => {
  const data = await getLiveProtocolData();
  await saveDataToWebflow({ collateral: data.collateral, circulatingSupply: data.supply, vaults: data.vaults });
  res.status(200).send('Success');  
};

openDollarCronJob({}, {
  status: (code) => ({ send: (message) => console.log(`Response ${code}: ${message}`) }),
});