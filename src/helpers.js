const _ = require('lodash')
const helpers = {}
helpers.wait = function (ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    });
}

helpers.equalityObjects = function(a, b) {
    const differences = this.differences(a, b);
    const d = differences.different.length + differences.missing_from_first.length + differences.missing_from_second.length;
    return d === 0 ? true : false;
}

helpers.differences = function (a, b) {
    const result = {
        different: [],
        missing_from_first: [],
        missing_from_second: []
    };

    _.reduce(a, (result, value, key) => {
        if (b.hasOwnProperty(key)) {
            if (_.isEqual(value, b[key])) {
                return result;
            } else {
                if (typeof (a[key]) !== typeof ({}) || typeof (b[key]) !== typeof ({})) {
                    result.different.push(key);
                    return result;
                } else {
                    const deeper = this.differences(a[key], b[key]);
                    result.different = result.different.concat(_.map(deeper.different, (sub_path) => key + '.' + sub_path));
                    result.missing_from_second = result.missing_from_second.concat(_.map(deeper.missing_from_second, (sub_path) => key + '.' + sub_path));
                    result.missing_from_first = result.missing_from_first.concat(_.map(deeper.missing_from_first, (sub_path) => key + '.' + sub_path));
                    return result;
                }
            }
        } else {
            result.missing_from_second.push(key);
            return result;
        }
    }, result);

    _.reduce(b, function (result, value, key) {
        if (a.hasOwnProperty(key)) {
            return result;
        } else {
            result.missing_from_first.push(key);
            return result;
        }
    }, result);
    return result;
}
module.exports = helpers