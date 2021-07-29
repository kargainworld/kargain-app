

import KargainContractData from "../config/Kargain.json"
import config from "../config/config"

import { useWeb3React } from "@web3-react/core"
import { useCallback, useEffect, useState } from "react"
import { isSuccessfulTransaction, waitTransaction } from "libs/confirmations"
import Web3 from "web3"
const ONE_HOUR = 3600 // sec
const ONE_DAY = ONE_HOUR * 24

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

            const receipt = await waitTransaction(library, tx.transactionHash)

            if (!isSuccessfulTransaction(receipt)) {
                throw new Error("Failed to confirm the transaction")
            }
        } catch (error) {
            throw parseBlockchainError(error)
        }
    }, [contract, account, library])

    const fetchOfferExpirationTime = useCallback(async () => {
        try {
            if (!contract)
                return

            const value = await contract.methods
                .offerExpiration().call()

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

    const offerExpired = useCallback(async (tokenId) => {
        if (!contract)
            return

        try {
            const value = await contract.methods
                .offerExpiration(tokenId).call()

            return value
        } catch (error) {
            // tokenId does not exist
            return null
        }
    }, [contract])

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

            const receipt = await waitTransaction(library, tx.transactionHash)

            if (!isSuccessfulTransaction(receipt)) {
                throw new Error("Failed to confirm the transaction")
            }
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

            const receipt = await waitTransaction(library, tx.transactionHash)

            if (!isSuccessfulTransaction(receipt)) {
                throw new Error("Failed to confirm the transaction")
            }
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
        offerExpired
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
