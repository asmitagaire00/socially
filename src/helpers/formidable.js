const formidable = require('formidable');

// eslint-disable-next-line no-use-before-define
module.exports = { parseMultiFormData };

function parseMultiFormData(req, res, next) {
  const form = formidable();

  form.parse(req, (err, fields, file) => {
    if (err) {
      console.log('Error while parsing file: ', err);
      return next(err);
    }
    req.body.image = file.image.path; // get image path
    req.body.caption = fields.caption;
    // eslint-disable-next-line no-underscore-dangle
    req.body.user = req.user._id.toString();
    return next();
  });
}
