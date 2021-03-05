const Web3 = require('web3');

/**
 * @param {string} address - Eth address
 * @return {boolean} boolean or error
 */
module.exports = (address) => {
  if (!Web3.utils.isAddress(address)) {
    throw new Error('That was not a valid eth address');
  }
  return true;
};
