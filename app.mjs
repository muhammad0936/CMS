import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import MySQLStoreOri from 'express-mysql-session';
import favicon from 'serve-favicon';
import path from 'path';
import url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MySQLStore = MySQLStoreOri(session);

// EXPRESS SQL OPTIONS :

const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '00000',
  database: 'cms'
};
const sessionStore = new MySQLStore(options);

const app = express();

import relations from './models/relations.mjs';
relations();

//Graphql stuff:
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema.mjs';
import resolvers from './graphql/resolvers.mjs';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(session({
  resave: false,
  saveUninitialized: false,
  key: 'session_cookie_secret',
  secret: 'supersecret',
  store: sessionStore,
  cookie: {expires: 500000}
}));

app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
  customFormatErrorFn: (err) => {
    console.error(err)
    if (!err.originalError) {
      return err;
    }
    const code = err.originalError.status || 500;
    const data = err.originalError.data || null;
    const message = err.message || 'An error occurred';
    return { message, status: code, data };
  }
}));
app.listen(3000);