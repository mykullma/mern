const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connect = async () => {
    try {
        await mongoose.connect(db);
        console.log('mongodb connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connect;