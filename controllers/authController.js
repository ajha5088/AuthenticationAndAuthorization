const AuthService = require("../services/authService");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  Register = async (req, res) => {
    try {
      console.log(`${req} , Inside authController ,Method:SignUp`);
      if (!req.body.username) {
        return res.status(400).json({ message: "Please provide the username" });
      }
      if (!req.body.password) {
        return res
          .status(400)
          .json({ messsage: "Please provide the password" });
      }
      let signupResponse = await this.authService.Register(req.body.username,req.body.password);
      console.log("Leaving from controller, Method:SignUp", signupResponse);
      res.status(200).json({signupResponse});
    } catch (error) {
      res.send(`Error in authController , Method: findProductById ,${error}`);
    }
  };

  Login = async (req, res) => {
    try {
      console.log("Inside authController, Method:Login");
      if (!req.body.username) {
        return res.status(400).json({ message: "Please provide the username" });
      }
      if (!req.body.password) {
        return res.status(400).json({ messsage: "Please provide the password" });
      }

      let authenticateUser = await this.authService.AuthenticateUser(req.body.username,req.body.password);
      
      if (authenticateUser.statusCode === 1100 ||authenticateUser.statusCode === 1101) {
        return res.status(401).json({message:authenticateUser.message});
      }

      req.session.isLoggedIn = true;
      req.session.user = authenticateUser.user;
      req.session.save((error) => {
        console.log(error);
      });
      console.log(authenticateUser)
      return res.status(200).json({ authenticateUser, message: "Logged in successfully" });
    } catch (error) {
      console.log("Error in authController,Method:Login", error);
    }
  };

  displayDashboard = async (req,res) =>{
    try {
        console.log("Inside authController, Method:displayDashboard");
        let username = req.session.user;
        res.status(200).send(`Welcome ${username} to the dashboard`)
    } catch (error) {
        console.log("Error in authController,Method:displayDashboard", error);
    }
  }

  displayAdminStatus = async (req,res)=>{
    try {
        console.log("Inside authController ,Method:displayAdminStatus");
        console.log(req)
        let userAdminStatus = req.session.isLoggedIn;
        console.log(userAdminStatus)
        res.status(200).send({message:`The status of the logged in user is ${userAdminStatus}`})
    } catch (error) {
        console.log("Error in authController,Method:displayAdminStatus", error)
    }
  }


Logout = async (req, res) => {
    try {
      let user = req.session.user;
      console.log(user);
  
      req.session.destroy(async (error) => {
        if (error) {
          console.log(error);
        }
  
        let LogoutResponse = await this.authService.deleteSession(user);
        const response = {
          message: `${user}'s session cleared`,
          logoutResponse: LogoutResponse,
        };
  
        res.status(200).json(response);
      });
    } catch (error) {
      console.log("Error in authController, Method: Logout", error);
    }
  };
}

module.exports = AuthController;
