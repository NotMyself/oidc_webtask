/*
    This webtask returns a compiler that will
    serve webtasks as static file. The CONTENT_TYPE
    meta value can be used to specify the content
    type of the returned static file. If not supplied
    content type 'text/plain' is used.
*/
const compiler = `
module.exports = (options, cb) => {
    return cb(null, (ctx, req, res) => {
        if (req.method !== 'GET') {
            res.writeHead(405);
            return res.end();
        }
        res.writeHead(200, { 'Content-Type': ctx.meta.CONTENT_TYPE || 'text/plain' });
        res.end(options.script);
    });
};
`;

/**
* @param context {WebtaskContext}
*/
module.exports = function(context, req, res) {
  res.writeHead(200, { 'Content-Type': 'application/javascript' });
  res.end(compiler);
};
