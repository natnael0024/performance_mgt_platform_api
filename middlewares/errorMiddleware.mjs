const errorMiddleware = (err, req, res, next)=> {
    
    let errorMessage = 'Internal Server Error';
  
    if (process.env.NODE_ENV === 'dev') {
      errorMessage = err.message;
    }
  
    // console.error(err);
  
    res.status(err.status || 500).json({ error: errorMessage });
  }

  export default errorMiddleware
  // module.exports = errorMiddleware