const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get users with income lower than $5 USD and BMW or Mercedes car
router.get('/users/lower-income-bmw-mercedes', (req, res) => {
  User.find({
    income: { $lt: 5 },
    'car.brand': { $in: ['BMW', 'Mercedes'] },
  })
  .then(users => res.json(users))
  .catch(err => res.status(500).json({ error:"Error fetching users with lower income and BMW/Mercedes cars:" + err.message }));
});

// Get male users with phone price greater than $10,000 USD
router.get('/users/male-high-price-phone', (req, res) => {
  User.find({
    gender: 'Male',
    'phone.price': { $gt: 10000 },
  })
  .then(users => res.json(users))
  .catch(err => res.status(500).json({ error:"Error retrieving male users with high price phone: " + err.message }));
});

// Get users whose last name starts with "M" and quote length > 15 and email includes last name
router.get('/users/quote-length-email-m', (req, res) => {
  User.find({
    lastName: { $regex: /^M/i },
    quote: { $gt: 15 },
    email: { $regex: /m$/i },
  })
  .then(users => res.json(users))
  .catch(err => res.status(500).json({ error: "Error retrieving users: " + err.message }));
});

// Get users with BMW, Mercedes, or Audi car and email does not include any digit
router.get('/users/car-brand-no-digit-email', (req, res) => {
  User.find({
    'car.brand': { $in: ['BMW', 'Mercedes', 'Audi'] },
    email: { $regex: /^\D+$/ },
  })
  .then(users => res.json(users))
  .catch(err => res.status(500).json({ error:"Error retrieving users with car brand: " +  err.message }));
});

// Get top 10 cities with highest number of users and their average income
router.get('/users/top-cities-income', (req, res) => {
    User.aggregate([
      { $group: { _id: '$address.city', count: { $sum: 1 }, totalIncome: { $sum: '$income' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { city: '$_id', count: 1, averageIncome: { $divide: ['$totalIncome', '$count'] } } }
    ]).exec((err, result) => {
      if (err) {
        return res.status(500).json({ error:"Error getting highest number of users" + err.message });
      }
      return res.status(200).json(result);
    });
  });
  

// Display the data in table format on the frontend
const Table = ({ data }) => {
return (
<table>
<thead>
<tr>
<th>First Name</th>
<th>Last Name</th>
<th>Email</th>
<th>Gender</th>
<th>Age</th>
<th>Quote</th>
<th>Income</th>
<th>Phone</th>
<th>Car</th>
<th>Address</th>
</tr>
</thead>
<tbody>
{data.map(user => (
<tr key={user._id}>
<td>{user.firstName}</td>
<td>{user.lastName}</td>
<td>{user.email}</td>
<td>{user.gender}</td>
<td>{user.age}</td>
<td>{user.quote}</td>
<td>{user.income}</td>
<td>{user.phone.brand} {user.phone.model} ({user.phone.price})</td>
<td>{user.car.brand} {user.car.model} ({user.car.year})</td>
<td>{user.address.street}, {user.address.city}, {user.address.state}, {user.address.country}, {user.address.zipcode}</td>
</tr>
))}
</tbody>
</table>
);
};

export default function Home({ data }) {
return (
<div>
<h1>Users with income lower than $5 USD and BMW or Mercedes car</h1>
<Table data={data[0]} />
<h1>Male users with phone price greater than $10,000 USD</h1>
<Table data={data[1]} />
<h1>Users whose last name starts with "M" and quote length 15 and email includes last name</h1>
<Table data={data[2]} />
<h1>Users with BMW, Mercedes, or Audi car and email does not include any digit</h1>
<Table data={data[3]} />
<h1>Top 10 cities with highest number of users and their average income</h1>
<Table data={data[4]} />
</div>
);
}

export async function getServerSideProps() {
const response = await Promise.all([
fetch(${process.env.BASE_URL}/api/users/lower-income-bmw-mercedes),
fetch(${process.env.BASE_URL}/api/users/male-high-price-phone),
fetch(${process.env.BASE_URL}/api/users/quote-length-email-m),
fetch(${process.env.BASE_URL}/api/users/car-brand-no-digit-email),
fetch(${process.env.BASE_URL}/api/users/top-cities-income),
]);

const data = await Promise.all(response.map(res => res.json()));

return { props: { data } };
}