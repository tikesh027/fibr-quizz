const { body } = require ('express-validator');

exports.userValidator = [
    body('name').not().isEmpty().withMessage("Please Fill Your Name"),
    body('email').not().isEmpty().withMessage("Fill Your Email"),
    body('password').isLength({min:6}).withMessage("Password Should be of minimum 6 Characters")
];

exports.loginValidator = [
    body('email').not().isEmpty().withMessage("Please Fill The required Email"),
    body('password').isLength({min:6}).withMessage("Password Should be consist minimum of 6 characters")
]