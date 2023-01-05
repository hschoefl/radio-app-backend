const errorHandler = (err, req, res, next) => {
  // define the status code
  const statusCode = res.statusCode ? res.statusCode : 500;

  const msg = err.message || 'An unexpected error occured';

  console.log(err);

  res.status(statusCode).json({ msg });
};

module.exports = { errorHandler };
