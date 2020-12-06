'use strict';

const { MongoClient } = require("mongodb");

const MONGO_URI = 'mongodb+srv://michaelmatos:3uf1gnGPpWSvaT8z@cluster0.vigfc.mongodb.net/seatsAvailable?retryWrites=true&w=majority'


const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {

    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    console.log("connected!");

    const db = client.db('seatsAvailable');
    const seats = {};
    const seatsRaw = await db.collection("seats").find().toArray();
    for(const elem of seatsRaw) {
        seats[elem._id] = {
            price: elem.price,
            isBooked: elem.isBooked
        }
    }

    if (seats === undefined || seats.length == 0) {
       console.log(`there're not seats available, first create a db`)
       res
        .status(404)
        .send('sorry buddy!')
    } else {
        return res.json({
            seats: seats,
            bookedSeats: 0,
            numOfRows: 8,
            seatsPerRow: 12,
          });

    }

    

    client.close();
    console.log("disconnected!");
    

} 

const bookSeat = async (req, res) => {
    const { seatId, creditCard, expiration, fullName, email } = req.body;
    console.log(`fullname ${fullName} && email ${email}`)


  try  { 
    
    var client = await MongoClient(MONGO_URI, options);
    await client.connect();
    console.log("connected!");

    const db = client.db('seatsAvailable');

   

    if (!creditCard || !expiration) {
        return res.status(400).json({
          status: 400,
          message: "Please provide credit card information!",
        });
      }


    const seat = await db.collection("seats").findOne({_id: seatId})

    console.log('seat', seat)

    if (!seat.isBooked) {
        const setParams = {isBooked: !seatId.isBooked, fullname: fullName, email: email}
       await  db.collection("seats").updateOne({_id: seatId},{$set: setParams}, function(err, result){
        if (err) throw err;
        res.status(200).json({
                status: 200,
                success: true,
              });
              client.close();
            console.log("disconnected!");
       })
        
    } 
} catch (err) {
    console.log(err.stack);
} 
  

};

module.exports ={
    getSeats,
    bookSeat
   }