const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    title: {
        type: Schema.Types.String,
        require: true,
    },
    questions: {
        type: [Schema.Types.ObjectId],
        ref: "Question",
    }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;