

import KargainContractData from "../config/Kargain.json"
import config from "../config/config"


import { useWeb3React } from "@web3-react/core"
import { useCallback, useEffect, useState } from "react"
import { isSuccessfulTransaction, waitTransaction } from "libs/confirmations"
import Web3 from "web3"
const ONE_HOUR = 3600 // sec
const ONE_DAY = ONE_HOUR * 24
const toBN = Web3.utils.toBN
const web3 = new Web3(Web3.givenProvider)

const MAX_EXPIRATION_TIME_DAYS = 266

const useKargainContract = () => {
    const { library, account } = useWeb3React()
    const [contract, setContract] = useState(null)

    useEffect(() => {
        if (!library)
            return

        if (account) {
            library.eth.defaultAccount = account
        }

        const kargainContract = new library.eth.Contract(KargainContractData.abi, config.contract.KARGAIN_ADDRESS)

        setContract(kargainContract)
    }, [account, library])

    const fetchPlatformPercent = useCallback(async () => {
        try {
            if (!contract)
                return

            const value = await contract.methods
                .platformCommissionPercent().call()

            return value
        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract])

    const watchOfferEvent = useCallback(async (tokenId) => {
        try {
            if (!contract || !library)
                return

            const START_BLOCK = 0

            const events = contract.getPastEvents("OfferReceived",
                {
                    fromBlock: START_BLOCK,
                    toBlock: 'latest' // You can also specify 'latest'
                })
                .then(events => {
                    for (let i = 0; i < events.length; i++) {
                        if (toBN(events[i].returnValues['tokenId']).toString(16) == tokenId) {
                            return events[i].returnValues['payer']
                        }
                    }

                })
                .catch((err) => console.error(err))
            return events
        }
        catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, library])

    const watchOfferRejected = useCallback(async (tokenId) => {
        try {
            if (!contract || !library)
                return

            const START_BLOCK = 0
            const events = contract.getPastEvents("OfferRejected",
                {
                    fromBlock: START_BLOCK,
                    toBlock: 'latest' // You can also specify 'latest'
                })
                .then(events => {
                    console.log(events[0].returnValues.tokenId)
                    console.log(tokenId)
                })
                .catch((err) => console.error(err))
            return events
        }
        catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, library])

    const watchOfferAccepted = useCallback(async (tokenId) => {
        try {
            if (!contract || !library)
                return

            const START_BLOCK = 0
            const events = contract.getPastEvents("OfferAccepted",
                {
                    fromBlock: START_BLOCK,
                    toBlock: 'latest' // You can also specify 'latest'
                })
                .then(events => {
                    console.log(events[0].returnValues.tokenId)
                    console.log(tokenId)
                })
                .catch((err) => console.error(err))
            return events
        }
        catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, library])

    const updatePlatformPercent = useCallback(async (percent) => {
        try {
            if (!contract || !library)
                return

            if (percent < 0 || percent > 100) {
                throw new Error("Percent must be between 0 and 100")
            }

            const tx = await contract.methods
                .setPlatformCommissionPercent(percent)
                .send({ from: account })

            const receipt = await waitTransaction(library, tx.transactionHash)

            if (!isSuccessfulTransaction(receipt)) {
                throw new Error("Failed to confirm the transaction")
            }
        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, account, library])

    const makeOffer = useCallback(async (tokenId, value) => {
        try {
            if (!contract)
                return

            const waiPrice = Web3.utils.toWei(value.toString(), 'ether')

            const tx = await contract.methods
                .createOffer(tokenId)
                .send({ from: account, value: waiPrice })

            return tx.transactionHash
        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, account])

    const fetchOfferExpirationTime = useCallback(async () => {
        try {
            if (!contract)
                return

            const value = await contract.methods
                .offerExpirationTime().call()

            return +value.toString() / ONE_DAY // returns days
        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract])

    const updateOfferExpirationTime = useCallback(async (days) => {
        try {
            if (!contract || !library)
                return

            if (days <= 0 || days > MAX_EXPIRATION_TIME_DAYS) {
                throw new Error(`Days must be between 1 and ${MAX_EXPIRATION_TIME_DAYS} days`)
            }

            const tx = await contract.methods
                .setOfferExpirationTime(days * ONE_DAY)
                .send({ from: account })

            const receipt = await waitTransaction(library, tx.transactionHash)

            if (!isSuccessfulTransaction(receipt)) {
                throw new Error("Failed to confirm the transaction")
            }
        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, account, library])


    const waitTransactionToBeConfirmed = useCallback(async (transactionHash) => {
        try {
            if (!library)
                return

            const receipt = await waitTransaction(library, transactionHash)

            if (!isSuccessfulTransaction(receipt)) {
                throw new Error("Failed to confirm the transaction")
            }
        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [library])

    const fetchTokenPrice = useCallback(async (tokenId) => {
        if (!contract)
            return

        try {
            const value = await contract.methods
                .tokenPrice(tokenId).call()
            const price = Web3.utils.fromWei(value, 'ether')

            return price.toString()
        } catch (error) {
            // tokenId does not exist
            return null
        }
    }, [contract])

    const acceptOffer = useCallback(async (tokenId) => {
        try {
            if (!contract || !library)
                return

            const tx = await contract.methods
                .acceptOffer(tokenId)
                .send({ from: account })

            return tx.transactionHash

        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, account, library])

    const rejectOffer = useCallback(async (tokenId) => {
        try {
            if (!contract || !library)
                return

            const tx = await contract.methods
                .rejectOffer(tokenId)
                .send({ from: account })

            return tx.transactionHash

        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, account, library])

    const mintToken = useCallback(async (tokenId, price) => {
        try {
            if (!contract || !library)
                return

            if (price <= 0) {
                throw new Error(`Price must be grater than zero.`)
            }

            const waiPrice = Web3.utils.toWei(price.toString(), 'ether')

            const tx = await contract.methods
                .mint(tokenId, waiPrice)
                .send({ from: account })

            return tx.transactionHash
        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, account, library])

    const updateTokenPrince = useCallback(async (tokenId, price) => {
        try {
            if (!contract || !library)
                return

            if (price <= 0) {
                throw new Error(`Price must be grater than zero.`)
            }

            const waiPrice = Web3.utils.toWei(price.toString(), 'ether')

            const tx = await contract.methods
                .setTokenPrice(tokenId, waiPrice)
                .send({ from: account })

            return tx.transactionHash
        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, account, library])

    return {
        isContractReady: contract ? true : false,
        contract,
        fetchPlatformPercent,
        updatePlatformPercent,
        fetchOfferExpirationTime,
        updateOfferExpirationTime,
        fetchTokenPrice,
        mintToken,
        updateTokenPrince,
        makeOffer,
        watchOfferEvent,
        watchOfferAccepted,
        watchOfferRejected,
        acceptOffer,
        rejectOffer,
        waitTransactionToBeConfirmed
    }
}

export default useKargainContract

function parseBlockchainError(error) {
    let result = error
    if (error.message.includes("VM Exception while processing transaction:")) {
        const regex = /"message":"VM Exception while processing transaction: (.*?)"/

        result = new Error(regex.exec(error.message)[1].replace("revert Kargain:", "").trim())
    }

    console.log("error", error, result)

    return result
}
