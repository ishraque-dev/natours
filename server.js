const dotenv = require('dotenv');
const mongoose = require('mongoose');
// Safety net for uncought exceptions
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
const app = require('./app');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('Connected to database');
});

const server = app.listen(process.env.PORT, () => {
  console.log('Listening on port 3000');
});

// Global safety net for unhandled Rejection
process.on('unhandledRejection', (error) => {
  console.log(error.name, error.message);
  console.log('Unhandled Rejection');
  server.close(() => {
    process.exit();
  });
});
