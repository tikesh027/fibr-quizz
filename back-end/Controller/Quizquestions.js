const Question = require("../Model/Question");
const Quiz = require("../Model/Quiz");
const User = require("../Model/user");

exports.questions = async (req, res, next) => {
  try {
    const newQuestion = new Question({
      questions: "",
      Option: [],
    });
    const question = await newQuestion.save();
    res.status(200).json({ question });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteQuestion = async (req, res, next) => {
  const questionId = req.params.question_id;
  const userId = req.userId;
  try {
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    await Quiz.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } },
      {}
    );
    await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { questions: questionId } },
      {}
    );
    res
      .status(200)
      .json({ msg: "Question Deleted Successfully", deletedQuestion });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.updatePerticularQuestion = async (req, res, next) => {
  const question_id = req.params.question_id;
  const { question, text } = req.body;

  try {
    const updatePerticularQuestion = Question.findByIdAndUpdate(
      question_id,
      {
        question: question,
        text: text,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ msg: "Question Update Successful", updatePerticularQuestion });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.createNewQuestion = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { question, options } = req.body;
    const newQuestion = new Question({
      question: question,
      options: options,
    });
    const savedQuestion = await newQuestion.save();
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        questions: savedQuestion._id,
      },
    });
    res.status(200).json(savedQuestion);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

exports.addQuestionToQuiz = async (req, res, next) => {
  try {
    // const userId = req.userId;
    const { question_id, quiz_id } = req.params;
    const updatedQuiz = Quiz.findByIdAndUpdate(quiz_id, {
      $addToSet: {
        questions: question_id,
      },
    });
    res.status(200).json(updatedQuiz);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

exports.removeQuestionFromQuiz = async (req, res, next) => {
  try {
    const { question_id, quiz_id } = req.params;
    const updatedQuiz = Quiz.findByIdAndUpdate(quiz_id, {
      $pull: {
        questions: question_id,
      },
    });
    res.status(200).json(updatedQuiz);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

exports.getAllQuestions = async (req, res, next) => {
  try {
    const userId = req.userId;
    const allQuestions = await User.findById(userId, {
      questions: true,
    }).populate("questions");
    res.status(200).json(allQuestions);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

exports.updateQuestionById = async (req, res, next) => {
  try {
    const { question_id } = req.params;
    const { question, options } = req.body;
    const updatedQuestion = await Question.findByIdAndUpdate(question_id, {
      question: question,
      options: options,
    });
    res.status(200).json(updatedQuestion);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};
