const Joi = require("@hapi/joi");

const middleware = (schema, property) => {
    return (req, res, next) => {     
        if(property == 'filter')
        {
            // below if() block checks if search contain special characters
            if(Object.keys(req.body).length)
            {
                let check = req.body.hasOwnProperty('search') && req.body.search.hasOwnProperty('value') && req.body.search.value.trim().length;
                if(check)
                {
                    let text = req.body.search.value;
                    let regexCheck = Joi.string().regex(new RegExp(/^[a-zA-Z\d\-_\s\(\)]+$/i));
                    const { error } = regexCheck.validate(text);
                    if(error)
                    {
                        let errors = [{
                            msg: 'Invalid input',
                            type: 'error'
                        }];
                        req.flash('errors', errors);
                        res.redirect('back');
                    }
                }
            }
        }
        const { error } = schema.validate(req.body);
        const valid = error == null;
        
        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');

            let errors = [{
                msg: message,
                type: 'error'
            }];
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.send(errors[0]);
            }
            req.flash('errors', errors);
            return res.redirect('back');
        }
    }
}
module.exports = middleware;