import { useState, useCallback } from 'react'

const usePriceTracker = () => {
    const [hasError, setErrors] = useState(false)
    const [coin, setCoin] = useState([])

    const getPriceTracker = useCallback(async () => {
        try {
            const price = await fetch("https://api.coinpaprika.com/v1/tickers/eth-ethereum?quotes=usd")
            price
                .json()
                .then(price => {
                    return price
                })
                .catch(err => setErrors(err))

            return price
        } catch (hasError) {
            return null
        }

    })


    return {
        getPriceTracker
    }

}

export default usePriceTracker
