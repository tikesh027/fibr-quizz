const Quiz = require("../Model/Quiz");
const Question = require("../Model/Question");
const User = require("../Model/user");
const path = require("path");

exports.createQuiz = async (req, res, next) => {
  const { title } = req.body;
  const userId = req.userId;
  //   req.userId = decodedToken._id;
  console.log(userId);

  try {
    const newQuiz = new Quiz({
      title: title,
      questions: [],
    });
    const quiz = await newQuiz.save();
    await User.findByIdAndUpdate(
      { _id: userId },
      {
        $addToSet: {
          quizzes: quiz._id,
        },
      }
    );
    res.status(200).json(quiz);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.createQuizQuestions = async (req, res, next) => {
  try {
    const quizId = req.params.quiz_id;
    const { question, options } = req.body;
    const newQuestion = new Question({
      question: question,
      options: options,
    });
    const savedQuestion = await newQuestion.save();
    await Quiz.findByIdAndUpdate(
      { _id: quizId },
      {
        $addToSet: {
          questions: savedQuestion._id,
        },
      }
    );
    res.status(200).json(savedQuestion);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteQuiz = async (req, res, next) => {
  const quizId = req.params.quiz_id;
  const userId = req.userId;
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    await User.findByIdAndUpdate(userId, {
      $pull: { quizzes: deletedQuiz._id },
    });
    res.status(200).json({ msg: "Delete Successful", deletedQuiz });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getPerticularQuiz = async (req, res, next) => {
  const quizId = req.params.quiz_id;
  try {
    const getPerticularQuiz = await Quiz.findOne({ _id: quizId }).populate(
      "questions"
    );
    res.status(200).json({ msg: "Success", getPerticularQuiz });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updatePerticularQuiz = async (req, res, next) => {
  const quizId = req.params.quiz_id;
  const { questions } = req.body;
  try {
    const updatePerticularQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      { questions: questions },
      { new: true }
    );
    res.status(200).json({ msg: "Update Successful", updatePerticularQuiz });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getAllQuiz = async (req, res, next) => {
  console.log("==========> hereeeeeee");
  try {
    const userId = req.userId;
    const allQuiz = await User.findById(userId, { quizzes: true }).populate(
      "quizzes"
    );
    res.status(200).json({ msg: "Done", data: allQuiz });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// exports.deleteQuizQuestion = async (req, res, next) => {
//   const quizId = req.params.quiz_id;
//   const questionId = req.params.Question_id;
//   try{

//   }
//   catch(error){
//     console.log(error);
//     res.status(500).json({ msg: "Internal Server Error"});
//   }
// }
