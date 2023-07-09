const Participant = require("../Model/Participant");
const Quiz = require("../Model/Quiz");

exports.registerParticipant = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const newParticipant = new Participant({
      email: email,
      name: name,
    });
    const savedParticipant = await newParticipant.save();
    res.status(200).json({ msg: "Saved successfully", savedParticipant });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.updateScore = async (req, res, next) => {
  try {
    const { email, quizPayload } = req.body;
    
    const updatedParticipant = await Participant.findOneAndUpdate({ email: email }, {
        $push: {
            quizzes: quizPayload
        }
    });
    res.status(200).json({ msg: "Saved successfully", updatedParticipant });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getParticipantQuiz = async (req, res, next) => {
  try{
    const quizId = req.params.quiz_id;
    const quiz = await Quiz.findById(quizId).populate('questions');
    res.status(200).json({msg: "Success", quiz});
    return;
  }catch(error){
    res.status(500).json({ msg: "Internal server error" });
  }
}