const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      require: true,
    },
    email: {
      type: Schema.Types.String,
      require: true,
    },
    quizzes: [
      {
        quiz: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Quiz",
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);

const Participant = mongoose.model("Participant", ParticipantSchema);

module.exports = Participant;
