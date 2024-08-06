const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// validate input for register and login user
const validateUser = ({ body }, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6).max(128),
    });

    const { error } = schema.validate(body);

    if (error) {
        const { details: [{ message: errMsg }] } = error;
        const errPattern = /\"/gi;
        let message = errMsg.replaceAll(errPattern, '');
        message = `${message.charAt(0).toUpperCase()}${message.slice(1)}`;
        return res.status(400).send({ success: false, message });
    }

    return next();
};

// validate input for create and edit note
const validateNote = ({ body, originalUrl }, res, next) => {
    const validations = {
        title: Joi.string().required()
    };

    // for edit note, check for note Id as well
    if (originalUrl.includes('edit'))
        validations.noteId = Joi.objectId().required() // note Id

    const schema = Joi.object(validations);

    const { error } = schema.validate(body, {
        abortEarly: false,
        allowUnknown: true,
    });

    if (error) {
        const { details: [{ message: errMsg }] } = error;
        const errPattern = /\"/gi;
        let message = errMsg.replaceAll(errPattern, '');
        message = `${message.charAt(0).toUpperCase()}${message.slice(1)}`;
        return res.status(400).send({ success: false, message });
    }

    return next();
}

// validate params for get and delete note
const validateNoteParams = ({ params }, res, next) => {
    const schema = Joi.object({
        noteId: Joi.objectId().required() // note Id
    });

    const { error } = schema.validate(params);

    if (error) {
        const { details: [{ message: errMsg }] } = error;
        const errPattern = /\"/gi;
        let message = errMsg.replaceAll(errPattern, '');
        message = `${message.charAt(0).toUpperCase()}${message.slice(1)}`;
        return res.status(400).send({ success: false, message });
    }

    return next();
}

module.exports = {
    validateUser,
    validateNote,
    validateNoteParams
};