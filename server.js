const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => {
  console.log(con.connections);
  console.log('Connected to database');
});

app.listen(process.env.PORT, () => {
  console.log('Listening on port 3000');
});
