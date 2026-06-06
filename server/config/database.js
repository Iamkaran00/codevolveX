import mongoose from "mongoose";

const dbconnection =   async () => {
    await mongoose.connect(`${process.env.BASE_URL}`)
    .then(()=>{
        console.log("Db connected successfully");
    })
    .catch(err => {
        console.error("Couldn't Connect with Database");
        process.exit(-1);
    })
}
export default dbconnection;