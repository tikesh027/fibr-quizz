const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    name: {
        type: Schema.Types.String,
        require: true,
    },
    email: {
        type: Schema.Types.String,
        require: true,
    },
    password : {
        type: Schema.Types.String,
        require: true,
    },
    quizzes: {
        type: [Schema.Types.ObjectId],
        ref: 'Quiz'
    },
    questions: {
        type: [Schema.Types.ObjectId],
        ref: 'Question'
    }
    
}, {timestamps: true});

const User = mongoose.model('user', UserSchema);

module.exports = User;