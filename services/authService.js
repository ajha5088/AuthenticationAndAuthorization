const AuthenticationRepo = require("../repositories/authRepo")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const constants = require("../config/appConstants")
const {MongoClient } = require("mongodb") 

class AuthService {
    constructor() {
        this.authenticationRepo = new AuthenticationRepo()
    }

    async Register(username, password) {
        try {
            console.log("Inside AuthService,Method;SignUp")
            password = await bcrypt.hash(password, 12);
            let createUser = { username, password }
            let user = await this.authenticationRepo.createUser(createUser)
            console.log("Leaving from AuthService , Method:SignUp ")
            return { message: "User created successfully", username }
        } catch (error) {
            console.log(`Error in AuthService , Method:SignUp ,${error}`)
            return { message: "User with this username already exists", error }
        }
    }

    async AuthenticateUser(username,password){
        try {
            console.log("Inside AuthService,Method;SignUp")
            let filter = {username:username}
            let findUser = await this.authenticationRepo.findUser(filter)
            if(findUser.length === 0){
                return {message:"User doesn't exists " ,statusCode:1100}
            }
            //to check password is correct or not
            let comparePassword = await bcrypt.compare(password,findUser[0].password)
            if(comparePassword === false){
                return {message:"Incorrect password" ,statusCode:1101}
            }
            const payload  = {username:findUser[0].username ,id:findUser[0]._id}
            const token = jwt.sign(payload,constants.secretOrPrivateKey,{expiresIn:"1d"})
            return {AuthenticationToken :`Bearer ${token}` , statusCode:1000 , message:"Logged in successfully" ,user:findUser[0].username}
        } catch (error) {
            console.log(`Error in AuthService , Method:AuthenticateUser ,${error}`)
            return { error: error }
        }
    }

    async deleteSession(user) {
        try {
            console.log("Inside AuthService, Method: deleteSession");
            const client = await MongoClient.connect(process.env.DB_URL);
            const db = client.db('test');
            const sessionsCollection = db.collection('sessions');

            const filter = { "session.user":`${user}`};
            const deleteSession = await sessionsCollection.deleteOne(filter);
            client.close();

            console.log("Leaving from AuthService, Method: deleteSession");
            return { message: 'Logged out successfully', deleteSession };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = AuthService;
