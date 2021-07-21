import { useState, useEffect } from 'react'
import PriceTracker from "../components/Blockchain/PriceTracker";

export function usePriceTracker() {
    const [hasError, setErrors] = useState(false)
    const [coin, setCoin] = useState([])

    async function fetchData() {
        const res = await fetch("https://api.coinpaprika.com/v1/tickers/eth-ethereum?quotes=usd")
        res
            .json()
            .then(res => setCoin(res))
            .catch(err => setErrors(err))
    }

    useEffect(() => {
        fetchData()
    })

}

export default PriceTracker
