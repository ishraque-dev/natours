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
// Defining A tour Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
// Creating a new tour model
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Test Tour',
  price: 499,
  rating: 3.5,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log('Listening on port 3000');
});
