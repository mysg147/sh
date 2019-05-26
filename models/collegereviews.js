var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;
var collegereviews = new Schema({
    username: String,
    newname: { type: Schema.Types.ObjectId, ref: 'User' },
    collegename:String,
    rtitle: String,
    content: String,
    year: Number,
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    branch: String,
    flag:{ type: Number , default:0 },
    createdAt: {
        type: Date,
        default: new Date(),
    }

});
collegereviews.plugin(mongoosastic, {
    hosts: [
        'localhost:9200'
    ]
});


module.exports = mongoose.model("collegereviews",collegereviews);
