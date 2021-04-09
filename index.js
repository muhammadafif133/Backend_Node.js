const Koa = require('koa');
const app = new Koa();

const articles = require('./routes/listings');


app.use(special.routes());
app.use(listings.routes());
app.use(users.routes());

let port = process.env.PORT || 3000;

app.listen(port);