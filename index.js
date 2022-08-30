const app = require('./server');
const config = require('./config/development');

const port = config.port;
app.listen(port, () => {
  console.log(`Server has started on ${port}`);
});