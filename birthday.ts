const mong = require('mongoose');
const Birthday = mong.Schema;
const birth = new Birthday({
    name : String,
    day:Number,
    month: {
        type:Number,
    }


})
const Birth = mong.model('birthday_tracker',birth);
module.exports=Birth;