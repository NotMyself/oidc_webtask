/*
    This webtask returns a compiler that will
    serve webtasks as static file. It is a convenience
    compiler that automatically set the content type
    to 'application/javascript'
*/
module.exports = (options, cb) => {
  return cb(null, (ctx, req, res) => {
      if (req.method !== 'GET') {
          res.writeHead(405);
          return res.end();
      }
      res.writeHead(200);
      return res.end(options.script);
  });
};
