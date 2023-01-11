const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
exports.checkId = (req, res, next, val) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Not found ',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Name or price is missing!',
    });
  }
  next();
};
// Get all tours.
exports.getAllTour = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    requestedAt: req.requestTime,
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((item) => item.id === +id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.createTour = (req, res) => {
  const newId = tours.slice(-1)[0].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  const newTour = ({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
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
