const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  const sources = ['body', 'params', 'query'];

  for (const source of sources) {
    if (schema[source]) {
      const { error, value } = schema[source].validate(req[source], { abortEarly: false, stripUnknown: true });

      if (error) {
        const message = error.details.map((d) => d.message).join(', ');
        return next(new ApiError(400, message));
      }

      req[source] = value;
    }
  }

  next();
};

module.exports = validate;
