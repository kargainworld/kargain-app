/**
 * Wait transactions to be mined.
 *
 * Based on https://ethereum.stackexchange.com/questions/82833/web3-js-call-event-handler-after-n-confirmations
 */

const DEFAULT_INTERVAL = 1500
 
const DEFAULT_BLOCKS_TO_WAIT = 1

const GANACHE_NETWORK_ID = 5777
  
/**
  * Wait for one or multiple transactions to confirm.
  *
  * @param web3
  * @param txnHash A transaction hash or list of those
  * @return Transaction receipt
  */
export async function waitTransaction(
    web3,
    txnHash
) {
    let isGanache = (await web3.eth.net.getId()) === GANACHE_NETWORK_ID

    let transactionReceiptAsync = async function(txnHash, resolve, reject) {
        try {                            
            let receipt = web3.eth.getTransactionReceipt(txnHash)
            if (!receipt) {
                setTimeout(function() {
                    transactionReceiptAsync(txnHash, resolve, reject)
                }, DEFAULT_INTERVAL)
            } else {
                if (DEFAULT_BLOCKS_TO_WAIT > 0) {
                    let resolvedReceipt = await receipt
                    if (!resolvedReceipt || !resolvedReceipt.blockNumber)
                        setTimeout(function() {
                            transactionReceiptAsync(txnHash, resolve, reject)
                        }, DEFAULT_INTERVAL)
                    else {
                        try {
                            let block = await web3.eth.getBlock(resolvedReceipt.blockNumber)
                            let current = await web3.eth.getBlock("latest")
                            
                            if (isGanache || current.number - block.number >= DEFAULT_BLOCKS_TO_WAIT) {
                                let txn = await web3.eth.getTransaction(txnHash)
                                if (txn.blockNumber != null) resolve(resolvedReceipt)
                                else
                                    reject(
                                        new Error(
                                            "Transaction with hash: " +
                         txnHash +
                         " ended up in an uncle block."
                                        )
                                    )
                            } else
                                setTimeout(function() {
                                    transactionReceiptAsync(txnHash, resolve, reject)
                                }, DEFAULT_INTERVAL)
                        } catch (e) {
                            setTimeout(function() {
                                transactionReceiptAsync(txnHash, resolve, reject)
                            }, DEFAULT_INTERVAL)
                        }
                    }
                } else resolve(receipt)
            }
        } catch (e) {
            reject(e)
        }
    }
 
    // Resolve multiple transactions once
    if (Array.isArray(txnHash)) {
        let promises = []
        txnHash.forEach(function(oneTxHash) {
            promises.push(waitTransaction(web3, oneTxHash))
        })
        return Promise.all(promises)
    } else {
        return new Promise(function(resolve, reject) {
            transactionReceiptAsync(txnHash, resolve, reject)
        })
    }
}
 
/**
  * Check if the transaction was success based on the receipt.
  *
  * https://ethereum.stackexchange.com/questions/82833/web3-js-call-event-handler-after-n-confirmations
  *
  * @param receipt Transaction receipt
  */
export function isSuccessfulTransaction(receipt) {
    if(receipt.events) {
        if(receipt.events.Approval || receipt.events.Staked || receipt.events.Swapped) {
            return true
        }
    }
 
    if (receipt.status == "0x1" || receipt.status == 1) {
        return true
    } else {
        return false
    }
}