import {  useCallback } from 'react'

const usePriceTracker = () => {

    const getPriceTracker = useCallback(async () => {
        try {
            const price = (await fetch("https://api.coinpaprika.com/v1/tickers/bnb-binance-coin?quotes=EUR")).json()
            return price
        } catch (error) {
            return null
        }
    })

    return {
        getPriceTracker
    }

}

export default usePriceTracker
