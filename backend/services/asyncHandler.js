// highter order function syntax
// asyncHandler -> takes any regular function and make it asynchronous
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (error) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export default asyncHandler;
