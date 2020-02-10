const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Inquirer = require('inquirer');
const debug = require('debug');

// Logger
const defaultDebug = debug('clone-workspace');
const logger = {
  error: (param, text) => {
    const extendedDebug = defaultDebug.extend('error').extend(param);
    extendedDebug(text);
  },
  debug: (param, text) => {
    const extendedDebug = defaultDebug.extend('debug').extend(param);
    extendedDebug(text);
  },
};

(
  async () => {
    try {
      const answers = await Inquirer.prompt([
        {
          type: 'input',
          name: 'express_path',
          message: 'Path for Mock Server',
          default: '',
        },
        {
          type: 'input',
          name: 'express_port',
          message: 'Mock Server Port',
          default: '',
        },
      ]);

      // express configs
      const corsOptions = {
        origin: true,
        optionsSuccessStatus: 200,
        exposedHeaders: ['Content-Length', 'Access-Control-Allow-Origin'],
        credentials: true,
      }
      const port = answers.express_port;
      const path = answers.express_path;

      logger.debug('express.port', port);
      logger.debug('express.path', path);

      // express app
      const app = express();
      app.use('*', cors(corsOptions));
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());

      app.get(path, (req, res) => {
        logger.debug('headers', req.headers);
        logger.debug('url', req.url);
        logger.debug('body', req.body);
        res.set('Access-Control-Allow-Origin', '*');
        res.status(404);
        res.json({ msg: 'Error' });
      });

      app.listen(port, () => console.log(`Example app listening on port ${port}!`));

    } catch (err) {
      logger.error('express.err', err);
    }
  }
)();