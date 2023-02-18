const slugify = require('slugify');
// Defining A tour Schema
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: 'The discount ({VALUE}) price should be bellow the price',
        validator: function (val) {
          return val < this.price;
        },
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // this will hide the field
    },
    startDates: [Date],
    slag: {
      type: String,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'difficult'],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
// Virtual properties
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});
//DOCUMENT MIDDLEWARE.(PRE) runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slag = slugify(this.name, { lower: true });
  next();
});
//(POST) runs after the .save() and .create()
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);

//   next();
// });
// ================
// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.post(/^find/, (doc, next) => {
  // console.log(doc);
  next();
});
// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});
// Creating a new tour model
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
