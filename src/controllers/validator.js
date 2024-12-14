const { body, validationResult } = require('express-validator');

function getErrorMessage(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorArray = errors.array();
        return errorArray.reduce((messsage, error) => {
            return messsage + error.msg + "<br>";
        }, '');
    }
    return null;
}



module.exports = { body, getErrorMessage };