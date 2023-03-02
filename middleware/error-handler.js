const errorHandlerMiddleWare = (err, req, res, next) => {
  res.status(500).json({ msg: err });
};

export default errorHandlerMiddleWare;
