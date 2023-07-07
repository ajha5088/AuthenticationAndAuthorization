const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware")
const AuthController = require("../controllers/authController")

const authController = new AuthController();

function routes(router){
    router.get("/displayAdminStatus" ,authMiddleware ,  authController.displayAdminStatus)
}

routes(router)

module.exports = router;