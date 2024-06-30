const middleware = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (err) {
            console.error('Error', err)
            next(err);
        }
    }
}

module.exports = middleware;