const express = require('express');
const router = express.Router();
const { orders } = require('../data/store');

let idCounter = 1;

// Price list
const priceList = {
  shirt: 50,
  pants: 80,
  saree: 100
};

// ✅ CREATE ORDER
router.post('/', (req, res) => {
  const { name, phone, garments } = req.body;

  let total = 0;

  garments.forEach(item => {
    total += priceList[item.type] * item.quantity;
  });

  const order = {
    id: idCounter++,
    name,
    phone,
    garments,
    total,
    status: "RECEIVED"
  };

  orders.push(order);

  res.json({
    message: "Order created",
    order
  });
});

// ✅ UPDATE STATUS
router.put('/:id/status', (req, res) => {
  const order = orders.find(o => o.id == req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = req.body.status;

  res.json({
    message: "Status updated",
    order
  });
});

// ✅ GET ALL ORDERS + FILTER
router.get('/', (req, res) => {
  const { status, name, phone } = req.query;

  let result = orders;

  if (status) result = result.filter(o => o.status === status);
  if (name) result = result.filter(o => o.name.toLowerCase().includes(name.toLowerCase()));
  if (phone) result = result.filter(o => o.phone.includes(phone));

  res.json(result);
});

// ✅ DASHBOARD
router.get('/dashboard', (req, res) => {
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const statusCount = {
    RECEIVED: 0,
    PROCESSING: 0,
    READY: 0,
    DELIVERED: 0
  };

  orders.forEach(o => {
    statusCount[o.status]++;
  });

  res.json({
    totalOrders,
    totalRevenue,
    statusCount
  });
});

module.exports = router;