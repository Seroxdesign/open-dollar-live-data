import { utils } from 'ethers'
import { BigNumber } from 'ethers'
/**
 * @dev Format a number to a string
 * @param input BigNumber string to format
 * @param decimals Number of BigNumber's decimals
 * @param formatDecimal Number of decimals to format to
 * @param currency Format as currency
 * @param compact Format as compact
 * @returns Formatted number
 */

export const WAD = BigNumber.from('1000000000000000000')

export function formatDataNumber(
    input,
    decimals = 18,
    formatDecimal = 2,
    currency,
    compact,
    minimumDecimals
) {
    let res = Number.parseFloat(input)

    if (decimals !== 0) res = Number.parseFloat(utils.formatUnits(input, decimals))

    if (res < 0.01) {
        let resString = res.toFixed(minimumDecimals)
        return `${currency ? '$' : ''}${resString}`
    }
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: minimumDecimals,
        maximumFractionDigits:
            minimumDecimals >= formatDecimal ? Math.min(minimumDecimals, formatDecimal) + 1 : formatDecimal,
        notation: compact ? 'compact' : 'standard',
        style: currency ? 'currency' : 'decimal',
        currency: 'USD',
    }).format(res)
}

export const multiplyWad = (wad1, wad2) => {
  const result = BigNumber.from(wad1).mul(BigNumber.from(wad2)).div(WAD)

  return result.toString()
}

