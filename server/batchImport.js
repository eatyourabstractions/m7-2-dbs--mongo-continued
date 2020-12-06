

const { MongoClient } = require("mongodb");

// require("dotenv").config();
// const { MONGO_URI } = process.env;

const MONGO_URI = 'mongodb+srv://michaelmatos:3uf1gnGPpWSvaT8z@cluster0.vigfc.mongodb.net/seatsAvailable?retryWrites=true&w=majority'

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const generateSeats = () => {
    // const seats = {};
    const seats = [];
    const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
    for (let r = 0; r < row.length; r++) {
    for (let s = 1; s < 13; s++) {
        const oneSeat = {
        _id: `${row[r]}-${s}`,
        price: 225,
        isBooked: false,
        };
        seats.push(oneSeat)
        }
    }
    return seats
}

const batchImport = async () =>{
    const seatsData = generateSeats();
    console.log(seatsData);
   
    try {
        const client = await MongoClient(MONGO_URI, options);
        await client.connect();
        const db = client.db('seatsAvailable');
        const result = await db.collection("seats").insertMany(seatsData);
        console.log('result', result);
    } catch (err) {
        console.log(err.stack);
    }
    client.close();
}

batchImport();

module.exports = {
    batchImport
}