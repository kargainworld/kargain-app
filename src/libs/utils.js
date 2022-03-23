import parseISO from 'date-fns/parseISO'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInMonths from 'date-fns/differenceInMonths'
import differenceInYears from 'date-fns/differenceInYears'
import { inflate, flatten } from 'flattenjs'
import queryString from 'query-string'
import supportedChains from './chains'
import config from 'config/config'


export const getLogo = () => '/images/Kargain_logo.png'

export const getLogoWhite = () => '/images/kargain-logo-white.png'

export const cleanObj = (obj) =>
    inflate(Object.entries(flatten(obj)).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {}))

export const cleanObjFlat = (obj) => Object.entries(flatten(obj)).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

export const buildUrl = (url, params = {}) => {
    return Object.keys(params).length !== 0
        ? `${url}?${queryString.stringify(params, {
            arrayFormat: 'comma',
            skipNull: true,
            skipEmptyString: true
        })}`
        : url
}

export const getTimeAgo = (isoTime, lang) => {
    const fr = lang === 'fr'
    const labels = {
        m: 'minute',
        ms: 'minutes',
        h: fr ? 'heure' : 'hour',
        hs: fr ? 'heures' : 'hours',
        d: fr ? 'jour' : 'day',
        ds: fr ? 'jours' : 'days',
        M: fr ? 'mois' : 'month',
        MS: fr ? 'mois' : 'months',
        y: fr ? 'année' : 'year',
        ys: fr ? 'années' : 'years'
    }

    const time = buildTime(isoTime, labels)
    if (!isoTime) return fr ? "A l'instant" : 'Just now'
    return fr ? `Il y a ${time}` : `${time} ago`
}

function buildTime(isoTime, labels) {
    if (!isoTime) return
    const date = parseISO(isoTime)
    const minutesAgo = differenceInMinutes(new Date(), date)
    if (minutesAgo === 1) return [minutesAgo, labels.m].join(' ')
    if (minutesAgo < 60) return [minutesAgo, labels.ms].join(' ')
    const hoursAgo = differenceInHours(new Date(), date)
    if (hoursAgo === 1) return [hoursAgo, labels.h].join(' ')
    if (hoursAgo < 24) return [hoursAgo, labels.hs].join(' ')
    const daysAgo = differenceInDays(new Date(), date)
    if (daysAgo === 1) return [daysAgo, labels.d].join(' ')
    if (daysAgo < 31) return [daysAgo, labels.ds].join(' ')
    const monthsAgo = differenceInMonths(new Date(), date)
    if (monthsAgo === 1) return [daysAgo, labels.M].join(' ')
    if (monthsAgo < 12) return [monthsAgo, labels.MS].join(' ')
    const yearsAgo = differenceInDays(new Date(), date)
    if (yearsAgo === 1) return [yearsAgo, labels.y].join(' ')
    return [differenceInYears(new Date(), date), labels.ys].join(' ')
}

export function getChainData(chainId) {
    if (!chainId) {
        return null
    }
    const chainData = supportedChains.filter((chain) => chain.chain_id === Number(chainId))[0]
    // console.log(typeof chainId)
    if (!chainData) {
        throw new Error('ChainId missing or not supported')
    }

    const API_KEY = config.contract.INFURA_ID

    if (chainData.rpc_url.includes('infura.io') && chainData.rpc_url.includes('%API_KEY%') && API_KEY) {
        const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY)

        return {
            ...chainData,
            rpc_url: rpcUrl
        }
    }

    return chainData
}

export function ellipseAddress(address = '', width = 10) {
    if (!address) {
        return ''
    }
    return `${address.slice(0, width)}...${address.slice(-width)}`
}


export function getNetwork() {
    return getChainData(config.main_chain_id).network
}