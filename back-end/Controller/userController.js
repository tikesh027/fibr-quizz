const User = require('../Model/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { JWT_TOKEN_SALT } = require('../Constant/Constant');


exports.registerNewUser = async (req, res, next) => {
    const error = validationResult(req);

    const { name, email, password } = req.body;
    try{
        const userEmail = await User.findOne({ email: email });

        if(userEmail && userEmail.email === email){
            res.status(400).json({ msg: "This Email Already Exist" });
            return;
        }

    }catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal Server Error"});
    }

    const encryptedPassword = await bcrypt.hashSync(password, 12);

    const newUser = new User({
        name: name,
        email: email,
        password: encryptedPassword,
    });

    try{
        const savedUser = await newUser.save();
        const response = {
            msg: "Register SuccessFull",
            user: savedUser,
        };
        response.user.password = undefined;
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error"});
    }
};


exports.logInUser = async (req, res, next) => {
    const { email, password} = req.body;

    try{
        const user = await User.findOne({ email: email });
        if(!user){
            res.status(400).json({ msg: "The Email Doen't Exist"});
            return;
        }
        const checkCorrectPassword = bcrypt.compareSync(password, user.password);
        if(!checkCorrectPassword){
            res.status(400).json({ msg: "Incorrect Password"});
            return;
        }

        const token = JWT.sign(
            {
                name: user.name,
                email: user.email,
                timestamp: new Date().toISOString(),
                _id: user._id,
            },
            JWT_TOKEN_SALT,
            { expiresIn: "10h" }
        );

        const responseBody = {
            msg: "LogIn Success",
            access_token: token,
            user: {
                name: user.name,
                email: user.email
            },
        };
        res.status(200).json(responseBody);

    }catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error"});
    }
    
};