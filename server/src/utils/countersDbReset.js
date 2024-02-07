import mongoose from 'mongoose';
import 'dotenv/config';
import fse from 'fs-extra';

(async function () {
  try {
    await mongoose.connect(process.env.DB_URL);
    const db = mongoose.connection;
    db.collection('movies').drop();
    db.collection('tvshows').drop();
    db.collection('episodes').drop();
    db.collection('seasons').drop();
    const counters = db.collection('counters');
    await counters.findOneAndUpdate({ _id: 'tvshowid' }, { $set: { seq: 0 } });
    await counters.findOneAndUpdate({ _id: 'movieid' }, { $set: { seq: 0 } });
    await counters.findOneAndUpdate({ _id: 'gameid' }, { $set: { seq: 0 } });
    await counters.findOneAndUpdate({ _id: 'episodeid' }, { $set: { seq: 0 } });
    //await counters.findOneAndUpdate({ _id: 'peopleid' }, { $set: { seq: 0 } });
    await counters.findOneAndUpdate({ _id: 'seasonid' }, { $set: { seq: 0 } });
    fse.emptyDirSync('./public/media/movie/');
    fse.emptyDirSync('./public/media/show/');
    console.log('Счетчики обнулены');
  } catch (e) {
    console.log(e);
  }
})();
