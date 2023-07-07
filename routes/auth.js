const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController")
const authMiddleware = require("../middlewares/authMiddleware")

const authController = new AuthController();

function routes(router){
    router.post("/Register" ,authController.Register)
    router.post("/login" ,authController.Login)
    router.get("/dashboard" ,authMiddleware ,authController.displayDashboard )
    router.post("/logout" ,authMiddleware, authController.Logout)
}

routes(router)

module.exports = router;