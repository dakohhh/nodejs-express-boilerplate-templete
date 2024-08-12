import mongoose from 'mongoose';
import settings from '../settings';

export const connect_to_mongo = async () => {
    try {
        await mongoose.connect(settings.MONGODB_URI);

        console.log(':::> Connection to MongoDB established.');
    } catch (error) {
        console.log('<::: Error connecting to MongoDB: ', error);
    }
};

// set mongoose options to have lean turned on by default | ref: https://itnext.io/performance-tips-for-mongodb-mongoose-190732a5d382
// mongoose.Query.prototype.setOptions = function () {
//     if (this.mongooseOptions().lean == null) {
//         this.mongooseOptions({ lean: true });
//     }

//     return this;
// };

export const disconnect_from_mongo = async () => {
    await mongoose.disconnect();

    console.log('Connection to MongoDB closed.');
};
