import 'reflect-metadata';
import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';
import { HttpException } from './exceptions/http.exception';
import { InversifyExpressServer } from 'inversify-express-utils';
import { globalErrorHandler } from './middleware/global-error-handler.middleware';
import { getServiceContainer } from './service-container';

import './features';

const rawPort = process.env.PORT;
const port = rawPort ? parseInt(rawPort, 10) : 80;
const host = '0.0.0.0';
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY || 'certs/key.pem'),
  cert: fs.readFileSync(process.env.SSL_CERT || 'certs/cert.pem')
};

const server = new InversifyExpressServer(getServiceContainer())
  .setConfig(svr =>
    svr.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }))
  )
  .setErrorConfig(svr =>
    svr
      .use((req, res, next) => next(new HttpException(404, '404 - Not Found')))
      .use(globalErrorHandler)
  )
  .build();

https.createServer(httpsOptions, server).listen(port, host, () => {
  console.log(`Server listening on port :${port}.`);
  console.log('Post on /tournaments to start a new tournament.');
});
