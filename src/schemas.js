import Joi from 'joi';
const schemas = {
    newUserSchema: Joi.object().keys({
        name: Joi.string().required(),
        company: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        skills: Joi.array().items(Joi.object().keys({
            skill: Joi.string().required(),
            rating: Joi.number().required()
        })).required()
    }),
    updateUserSchema: Joi.object().keys({
        name: Joi.string().optional(),
        company: Joi.string().optional(),
        email: Joi.string().optional(),
        phone: Joi.string().optional(),
        skills: Joi.array().items(Joi.object().keys({
            skill: Joi.string().required(),
            rating: Joi.number().required()
        })).optional()
    }),
    newSkillSchema: Joi.object().keys({
        hacker_id: Joi.number().required(),
        skill: Joi.string().required(),
        rating: Joi.number().required()
    }),
    eventAttendSchema: Joi.object().keys({
        hacker_id: Joi.number().required(),
        event_id: Joi.number().required()
    })
};

export { schemas };