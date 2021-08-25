const formidable = require('formidable');

// eslint-disable-next-line no-use-before-define
module.exports = { parseMultiFormData };

function parseMultiFormData(req, res, next) {
  const form = new formidable.IncomingForm();

  req.body.user = req.user.id.toString();

  form.parse(req, (err, fields, file) => {
    if (err) {
      console.log('Error while parsing file: ', err);
      return next(err);
    }
    req.body.image = file.image ? file.image.path : undefined; // get image path
    req.body.caption = fields.caption || undefined;
    // eslint-disable-next-line consistent-return
    return next();
  });
}
