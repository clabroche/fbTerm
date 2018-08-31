const helpers = {}
helpers.wait = function (ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    });
}
module.exports = helpers