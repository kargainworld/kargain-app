const isProd = process.env.NODE_ENV === 'production'// TODO: remove || true
const devApi = 'http://localhost:8080/v1'
const api = isProd ? process.env.NEXT_PUBLIC_API_ROUTE ? process.env.NEXT_PUBLIC_API_ROUTE : 'https://api.kargain.com/v1' : devApi
module.exports = {
    all : process.env,
    env : process.env.NODE_ENV,
    isProd,
    api,
    sso_providers: ['google'],
    contentful : {
        CONTENTFUL_ACCESS_TOKEN : process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
        CONTENTFUL_SPACE_ID : process.env.NEXT_PUBLIC_CONTENFUL_SPACE_ID
    },
    stripe: {
        API_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
    },
    google: {
        static:{
            STATIC_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
        },
        sso: {
            CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_SSO_CLIENT_ID
        }
    },
    contract: {
        KARGAIN_ADDRESS: process.env.NEXT_PUBLIC_KARGAIN_ADDRESS,
        INFURA_ID: 'de98845889164596b64d51908b361ce2' // 460f40a260564ac4a4f4b3fffb032dad
    },
    main_chain_id: process.env.NEXT_PUBLIC_MAIN_CHAIN_ID
}
