const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const multer = require('multer');
const {Product} = require('../models/Product');


//=================================
//             Product
//=================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({ storage: storage }).single("file")

router.post('/image', (req,res) => {

  // store image
  upload(req,res,err => {
    if(err) {
      return req.json({success:false,err})
    }
    return res.json({success:true, filePath:res.req.file.path , fileName:res.req.file.filename })
    
    

  })
})


router.post('/', (req,res) => {

  const product = new Product(req.body)
  product.save((err) => {
    if(err) return res.status(400).json({success:false,err})
    return res.status(200).json({success:true})
  })

})

router.post('/products', (req,res) => {

  Product.find()
  .populate("writer")
  .exec((err,productInfo) => {
    if(err) return res.status(400).json({success:false,err})
    return res.status(200).json({success:true,productInfo})
  })

})

module.exports = router;
