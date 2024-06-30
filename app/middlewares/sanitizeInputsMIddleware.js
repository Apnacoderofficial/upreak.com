const Utils = require('./../../public/js/commonUtils');
const utils = new Utils();

const middleware = () => {
    return (req, res, next) => {
        let errors = [];
        const validateAndSanitize = (value, key) => {
            const notAllowedCharsAtZero = ['@', '=', '+'];
            if (typeof value === 'string') {
                if (notAllowedCharsAtZero.indexOf(value.split('')[0]) > -1 && key != 'formula') {
                    errors.push('Illegal Character in the input :' + key);
                }
                value = utils.encodeHTML(value); //Sanitize All HTML Chars before saving.
            }

            if (typeof value === 'object' && value && Object.keys(value).length > 0) {
                for (const key in value) {
                    if (value.hasOwnProperty(key)) {
                        value[key] = validateAndSanitize(value[key], key);
                    }
                }
            }
            return value;
        }

        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                req.body[key] = validateAndSanitize(req.body[key], key);
            }
        }

        for (const key in req.params) {
            if (req.params.hasOwnProperty(key)) {
                req.params[key] = validateAndSanitize(req.params[key], key);
            }
        }

        for (const key in req.query) {
            if (req.query.hasOwnProperty(key)) {
                req.query[key] = validateAndSanitize(req.query[key], key);
            }
        }

        if (errors.length == 0) {
            next();
        } else {
            const message = errors.join(',');
            let errorObj = [{
                msg: message,
                type: 'error'
            }];
            req.flash('errors', errorObj);
            res.redirect('back');
        }
    }
}
module.exports = middleware;