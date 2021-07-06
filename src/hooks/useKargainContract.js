

import KargainContractData from "../config/Kargain.json"
import config from "../config/config"

import { useWeb3React } from "@web3-react/core"
import { useCallback, useEffect, useState } from "react"

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
        if (!contract)
            return
        
        const value = await contract.methods
            .platformCommissionPercent().call()

        return value
    }, [contract])

    const updatePlatformPercent = useCallback(async (percent) => {
        if (!contract)
            return

        if (percent < 0 || percent > 100) {
            throw new Error("Percent must be between 0 and 100")
        }

        await contract.methods
            .setPlatformCommissionPercent(percent).send({ from: account })
    }, [contract, account])

    return { contract, fetchPlatformPercent, updatePlatformPercent }
}

export default useKargainContract