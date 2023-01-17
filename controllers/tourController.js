const Tour = require('./../models/tourModel');

// Get all tours.
exports.getAllTour = (req, res) => {
  // console.log(req.requestTime);
  // res.status(200).json({
  //   requestedAt: req.requestTime,
  //   status: 'success',
  //   results: tours.length,
  //   data: {
  //     tours,
  //   },
  // });
};
exports.getTour = (req, res) => {
  // const { id } = req.params;
  // const tour = tours.find((item) => item.id === +id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};
exports.updateTour = (req, res) => {
  // const { id } = req.params;

  res.status(200).json({
    status: 'success',
    message: 'Updated',
  });
};
exports.deleteTour = (req, res) => {
  // const { id } = req.params;
  res.status(204).json({
    status: 'success',
    message: 'deleted successfully',
  });
};
