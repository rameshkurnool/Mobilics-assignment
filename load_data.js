const mongoose = require('mongoose');
const User = require('./models/User');
const sampleData = require('./data/sample_data.json');

mongoose.connect('mongodb://localhost/sample_data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected');
  return User.deleteMany({});
})
.then(() => {
  console.log('Existing data deleted');
  return User.insertMany(sampleData);
})
.then(() => console.log('Sample data loaded'))
.catch(err => console.log(err))
.finally(() => mongoose.disconnect());
