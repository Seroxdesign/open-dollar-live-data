import { ethers } from 'ethers'
import { Geb, utils } from '@opendollar/sdk'
import { fetchPoolData } from '@opendollar/sdk'
import { fetchAnalyticsData } from '@opendollar/sdk/lib/virtual/virtualAnalyticsData.js'
import { formatDataNumber, multiplyWad } from './utils.js'

const provider = new ethers.providers.JsonRpcProvider('https://arbitrum.blockpi.network/v1/rpc/public')

// Create the main GEB object
const geb = new Geb('arbitrum', provider)

export const getLiveProtocolData = async () => {
 
  const [poolData, analyticsData] = await Promise.all([fetchPoolData(geb), fetchAnalyticsData(geb)])

  let totalLockedValue = ethers.BigNumber.from(0)
  Object.entries(analyticsData?.tokenAnalyticsData).map(([key, value]) => {
    const lockedAmountInUsd = multiplyWad(
        value?.lockedAmount?.toString(),
        value?.currentPrice?.toString()
    )
    totalLockedValue = totalLockedValue.add(lockedAmountInUsd)
  })
  const supply = formatDataNumber(analyticsData.erc20Supply, 18, 2, true)
  const vaults = analyticsData.totalVaults
  const collateral = formatDataNumber(totalLockedValue.toString(), 18, 2, true, true)
  return { supply, vaults, collateral }
}