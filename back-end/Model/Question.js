const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    question: {
        type: Schema.Types.String,
        require: true,
    },
    options: {
        type: [{
            text: String,
            isCorrect: Boolean,
        }],
        require: true,
    }
}, { timestamps: true });


const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;