const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');

const special = require('./routes/special.js')
const listings = require('./routes/listings.js');
const users = require('./routes/users.js');

app.use(special.routes());
app.use(listings.routes());
app.use(users.routes());
app.use(cors());

let port = process.env.PORT || 3000;

app.listen(port);