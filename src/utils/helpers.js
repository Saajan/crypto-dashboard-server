import rp from 'request-promise';


export const getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};


export const eachApiCall = function (coinPair) {
    return rp({
        url: `https://api.coinbase.com/v2/prices/${coinPair}/buy`,
        json: true
    }).then(function (obj) {
        return obj.data;
    });
}