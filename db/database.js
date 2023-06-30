let mongoose = require('mongoose');

const server = 'localhost:27017';
const database = 'pencil';

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(`mongodb://admin:admin@localhost:27017/pencil`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error', err);
      });
  }
}

module.exports = new Database();