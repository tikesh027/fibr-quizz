const express = require("express");

const { registerNewUser, logInUser } = require("../Controller/userController");
const { userValidator, loginValidator } = require("../MiddleWare/Validator/Validator");
const { createQuiz, createQuizQuestions, deleteQuiz, getPerticularQuiz, updatePerticularQuiz, getAllQuiz } = require("../Controller/QuizController");
const { authmiddleware } = require("../MiddleWare/Authmiddleware/authmiddleware");
const { deleteQuestion, updatePerticularQuestion, createNewQuestion, addQuestionToQuiz, removeQuestionFromQuiz, getAllQuestions, updateQuestionById } = require("../Controller/Quizquestions");
const { registerParticipant, updateScore, getParticipantQuiz } = require("../Controller/ParicipantController");

const router = express.Router();

router.post('/register', userValidator, registerNewUser);
router.post('/login', loginValidator, logInUser);
// router.get('/user',authmiddleware, )
// Quiz
router.post('/quiz', authmiddleware, createQuiz);
router.get('/quiz/all', authmiddleware, getAllQuiz);
router.delete('/quiz/:quiz_id', authmiddleware, deleteQuiz);
router.get('/quiz/:quiz_id', authmiddleware, getPerticularQuiz);
router.put('/quiz/:quiz_id', authmiddleware, updatePerticularQuiz);
router.post('/quiz/:quiz_id/:question_id', authmiddleware, addQuestionToQuiz);
router.delete('/quiz/:quiz_id/:question_id', authmiddleware, removeQuestionFromQuiz)

// Questions
router.post('/question', authmiddleware, createNewQuestion);
router.get('/question/all', authmiddleware, getAllQuestions);
router.delete('/question/:question_id', authmiddleware, deleteQuestion);
router.put('/question/:question_id', authmiddleware, updateQuestionById);

router.post('/participant/register', registerParticipant);
router.post('/participant/score', updateScore);
router.get('/participant/quiz/:quiz_id', getParticipantQuiz);

// router.post('/quiz/:quiz_id/question', authmiddleware, createQuizQuestions);




// router.delete('/quiz/:quiz_id/question', )// delete quiz question
// router.get('/quiz/:quiz_id', )// bring one perticular quiz -- populated
// patch should be made to update questions and options.......// quiz title // 



module.exports = router;

//mongodb+srv://tikeshsingh2797:<password>@cluster0.lk2mj6l.mongodb.net/?retryWrites=true&w=majority