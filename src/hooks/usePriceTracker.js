import { useCallback } from 'react'

const usePriceTracker = () => {

    const getPriceTracker = useCallback(async () => {
        try {
            const price = (await fetch("https://api.coinpaprika.com/v1/tickers/matic-polygon?quotes=USD")).json()
            return price
        } catch (error) {
            return null
        }
    }, [])

    return {
        getPriceTracker
    }

}

export default usePriceTracker
