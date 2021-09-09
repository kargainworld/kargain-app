import handleResponse from '../libs/handleResponse'
import config from '../config/config'

function addTransaction (body) {
    const url = `${config.api}/transactions/add`
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }

    return fetch(url, requestOptions)
        .then(handleResponse)
        .then(json => json.data)
        .catch(err => {
            throw err
        })
}

function updateTransaction (announceId, body) {
    const url = `${config.api}/transactions/${announceId}/update`
    const requestOptions = {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }

    return fetch(url, requestOptions)
        .then(handleResponse)
        .then(json => json.data)
        .catch(err => {
            throw err
        })
}

function getTransactionsByAnnounceId (announceId) {
    const url = `${config.api}/transactions/${announceId}`
    const requestOptions = {
        method: 'GET',
        credentials: 'include'
    }

    return fetch(url, requestOptions)
        .then(handleResponse)
        .then(json => json.data)
        .catch(err => {
            throw err
        })
}

export default {
    addTransaction,
    updateTransaction,
    getTransactionsByAnnounceId
}
