const {
  addItem: addItemQuery,
  getItem: getItemQuery,
  getItems
} = require('../db/queries/example.js');

const getItem = async (req, res) => {
  const item = await getItemQuery(req.params.itemId);
  return res.status(200).send({ item });
};

const getAllItems = async (req, res) => {
  const items = await getItems(req.body);
  return res.status(200).send({ items });
};

const addItem = async (req, res) => {
  await addItemQuery(req.body);
  res.send('OK');
};

module.exports = {
  addItem,
  getAllItems,
  getItem
};