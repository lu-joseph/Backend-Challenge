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

function validateInteger(num, res) {
    if (isNaN(parseInt(num))) {
        res.status(400).send(num + " is not a valid number");
        return false;
    }
    return true;
}

function validateIntegerParam(name) {
    return (req, res, next) => {
        if (validateInteger(req.params[name], res))
            next();
    }
}


export { validateBodySchema, validateIntegerParam, validateInteger };