const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Query');

const paginatedList = require('./paginatedList');
const create = require('./create');
const read = require('./read');
const update = require('./update');
const sendMail = require('./sendMail');
const remove = require('./delete'); 

methods.create = create;
methods.list = paginatedList;
methods.read = read;
methods.update = update;
methods.delete = remove;
methods.mail = sendMail;


module.exports = methods;
