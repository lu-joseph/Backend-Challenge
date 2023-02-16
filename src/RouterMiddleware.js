import Joi from 'joi';
function validateBodySchema(schema, property) {
    return (req, res, next) => {
        const error = schema.validate(req.body);
        if (!error) {
            next();
        } else {
            console.log("error", error);
            res.status(400).json({ error: error })
        }
    }
}

function validateIntegerParam(name) {
    return (req, res, next) => {
        if (isNaN(parseInt(req.params[name])))
            res.status(400).send(`Invalid {${name}} parameter`);
        else
            next();
    }
}
export { validateBodySchema, validateIntegerParam };