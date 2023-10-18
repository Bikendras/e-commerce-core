const express = require("express");
const router= express.Router();
const indexController=require("../controllers/index-controller");
var multer = require("multer");
// var upload = multer();
// below we take this from multer npm , and the alternate of multer np is *busbuy*....
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'E:/bikendra/Bikendra/Domain/frontend/public') // destination is a place where it store the image...(jaha par image ko store ko store karna hai waha ka Adrress dena hai..)
    },
    filename: function (req, file, cb) {

      cb(null,file.originalname) // backend me us file ka original name jo user ne jiss name se save kiya tha usi name se save kiya ja raha hai...
    }
  })
  const upload = multer({ storage: storage })
  
  var verify=require("../middleware/verify");


router.get('/', indexController.rootApi);
router.post('/register',upload?.single(),indexController.registerApi);
router.post("/login", upload?.single(),indexController.loginApi);
router.get("/getdata", indexController.alluserApi);
router.post("/update/:email", upload?.single(), verify, indexController.updateApi);
router.post("/disableUser/:email", upload?.single(), verify, indexController.disableUserApi);
router.post("/enableUser/:email", upload?.single(), verify, indexController.enableUserApi);
router.post("/delete/:email", upload?.single(), verify,indexController.deleteApi );
router.get("/specificUser/:email",verify, indexController.specificUserApi );
// image is a field name of form, it only post the image on particular field...  and connect is frantend component userDetail...
router.post("/userImageUpload/:email", upload?.single("image"),verify, indexController.imageUpload );
// orderBooked 
router.post("/user/:email/OrderBooked", upload?.single(),verify, indexController.OrderBookedApi );
router.get("/user/:email/orderDetail",upload?.single(), indexController.orderDetailApi) // Order booked list API...
router.post("/user/myaddCardApi/:email",upload?.single(),indexController.myAddCartApi) // Added cart Successfully
router.get("/user/mygetCardApi/:email",upload?.single(),indexController.mygetCartApi) // Get cart data Successfully
router.post("/user/cardremove/:id",upload?.single(),indexController.cartRemoveApi) // Remove cart Successfully
router.post("/MarchantProductInsert/:email",upload?.single(),verify, indexController.marchentOrderApi) // Merchant Added cart Data Successfully
router.get("/MarchantProductget/:email",verify, indexController.merchantgetApi) // Merchant get cart data Successfully
router.post("/productdelete/:id",upload?.single(), indexController.merchantDataDeleteAPI) // Merchant delete cart data Successfully
module.exports=router;



