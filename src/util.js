const util = require('util');

const prettyPrintResponse = (response) => {
    console.log(util.inspect(response, { colors: true, depth: 4 }));
};

const formatError = (error) => {
    return {
        error: { ...error.data, status_code: error.status },
    };
};

module.exports = {
    prettyPrintResponse: prettyPrintResponse,
    formatError: formatError
}