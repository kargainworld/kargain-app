import { usePriceTracker } from '../../hooks/usePriceTracker'
import React, { useEffect } from 'react'

const PriceTracker = () => {

    const priceTracker = usePriceTracker()

    useEffect(() => {
        console.log(priceTracker)
    })

    return (
        <div>
            <h1>Price ETH: {priceTracker}</h1>
        </div>
    )
}

export default PriceTracker
