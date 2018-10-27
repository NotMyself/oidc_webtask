module.exports = function (options, cb) {
  return cb(null, function (context, req, res) {
    const scripts = [];
    const styles = [];
    const transpile = (callback) => {
      if (context.meta.env !== 'prod') {
        return callback(null, transpileBabel(options.script, context));
      }

      context.storage.get((error, data) => {
        if (error) return callback(error);

        if (context.query.refresh === '1') {
          delete data.bundle;
        }

        if (data && typeof data.bundle !== 'undefined') return callback(null, data.bundle);

        const bundle = transpileBabel(options.script, context);

        context.storage.set({ bundle: bundle }, { force: 1 }, (error) => {
          if (error) return callback(error);

          callback(null, bundle)
        });
      });
    };

    try {
      JSON.parse(context.meta.scripts).forEach((s) => {
        scripts.push(`<script src="${s}"></script>`);
      });
    } catch(e) {
      // TODO: Report errors if you are running with `env:dev`
    }

    try {
      JSON.parse(context.meta.styles).forEach((s) => {
        styles.push(`<link rel="stylesheet" href="${s}">`);
      });
    } catch (e) {
      // TODO: Report errors if you are running with `env:dev`
    }

    const react = context.meta.env === 'prod' ? [
      '<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>',
      '<script crossorigin src="https://unpkg.com/react-router-dom@4.3.1/umd/react-router-dom.min.js"></script>',
      '<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>',
      '<script crossorigin src="https://unpkg.com/auth0-js@9.8.1/dist/auth0.min.js"></script>'
    ] : [
      '<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>',
      '<script crossorigin src="https://unpkg.com/react-router-dom@4.3.1/umd/react-router-dom.js"></script>',
      '<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>',
      '<script crossorigin src="https://unpkg.com/auth0-js@9.8.1/dist/auth0.js"></script>'
    ];

    transpile((err, bundle) => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>${module.webtask.meta.title || 'React View'}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">

            ${styles.join('\n')}

            ${react.join('\n')}

            <script crossorigin src="https://unpkg.com/prop-types@15.6/prop-types.min.js"></script>
            <script crossorigin src="https://unpkg.com/emotion@9.1/dist/emotion.umd.min.js"></script>
            <script crossorigin src="https://unpkg.com/react-emotion@9.1/dist/emotion.umd.min.js"></script>

            ${scripts.join('\n')}

            <style>
              html, body, #root {
                height: 100%;
              }
            </style>
        </head>
        <body>
            <div id="root"></div>
            <script>${bundle}</script>
        </body>
        </html>
      `;

      res.writeHead(200, { 'Content-Type': 'text/html ' });
      res.end(html);
    });
  });
};

function transpileBabel(code, context) {
  const babel = require("/data/_verquire/babel-core/6.26.3/node_modules/babel-core");

  const tCode = `
    window.styled = window['react-emotion'].default;
    window.WebtaskContext = ${JSON.stringify({ meta: module.webtask.meta, secrets: module.webtask.secrets })};

    ${code}

    ReactDOM.render(
      <App />,
      document.getElementById('root')
    );
  `;

  const config = {
    presets: [
      '/data/_verquire/babel-preset-env/1.7.0/node_modules/babel-preset-env',
      '/data/_verquire/babel-preset-react/6.24.1/node_modules/babel-preset-react'
    ],
    plugins: [
      '/data/_verquire/babel-plugin-emotion/9.2.11/node_modules/babel-plugin-emotion',
      '/data/_verquire/babel-plugin-transform-object-rest-spread/6.26.0/node_modules/babel-plugin-transform-object-rest-spread'
    ]
  };

  if (context.meta.env === 'prod') {
    config.comments = false;
    config.compact = true;
    config.minified = true;
  }

  const result = babel.transform(tCode, config);

  return result.code;
}
