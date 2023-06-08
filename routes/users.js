const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// getall user api#api
router.get("/",async (req, res)=>{
    const userList = await User.find().select('-password');
    if (!userList){
        res.status(500).json({
            success: false
        })
    }
    res.send(userList);
})

// admin remove or add users#api
router.post('/', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    // console.log(req.body);
    try {
        user = await user.save();
        console.log('user saved successfully');
      } catch (error) {
        console.error('Error saving user:', error);
      }
    
    // user = await user.save();
    
    if(!user){
        res.status(404).send('The user cannot be created')
    }else{
        res.send(user);
    }
})


// register#api
router.post('/register', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    // console.log(req.body);
    try {
        user = await user.save();
        console.log('user saved successfully');
      } catch (error) {
        console.error('Error saving user:', error);
      }
    
    // user = await user.save();
    
    if(!user){
        res.status(404).send('The user cannot be created')
    }else{
        res.send(user);
    }
})




// getuser#api
router.get('/:id', async (req,res)=>{
    const user = await User.findById(req.params.id).select('-password');
    if (!user){
        res.status(500).json({
            message: "The user with the Given Id was not found"
        })
    }
    res.status(200).send(user)
    })




    // edit#api
router.put('/:id', async (req,res)=>{
    const userExist = await User.findById(req.params.id);
    let newPassword

    if (!req.body.password){
        
        newPassword = bcrypt.hashSync(req.body.password, 10)
     
        }
        else{
newPassword = userExist.password
        }

        const user =await new User.findByIdAndUpdate(
            req.params.id,
            {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        {new: true}
        )
        // console.log(req.body);
        
        
        // user = await user.save();
        
        if(!user){
            res.status(404).send('The user cannot be created')
        }else{
            res.send(user);
        }
    
    
    
    })
    
    
   


// login#api
    router.post('/login', async(req,res)=>{
        const user = await User.findOne({email: req.body.email})
        const secret = process.env.secret

        // console.log(secret);
        if (!user){
            res.status(400).json({
                message: "The user with the Given email was not found"
            })
        }

        
        if(user && bcrypt.compareSync(req.body.password , user.password)){

            const token = jwt.sign({
                userId: user.id,
                isAdmin: user.isAdmin
               
            },
           secret,
           {expiresIn: '1d'}
            )
            res.status(200).send({user: user.email,token : token} )
        }else{
            res.status(400).send('Password is wrong')
        }
        
    })


    // user count#api
    router.get('/get/count',async (req, res)=>{

        const userCount = await User.countDocuments()
        
        if (!userCount){
          res.status(500).json({
            success: false
          })
        }
        res.send({
          userCount: userCount
      })
      })


      // delete#api
      router.delete('/:id',(req,res)=>{
        User.findByIdAndRemove(req.params.id).then(user=>{
            if(user){
                return res.status(200).json({
                    success: true,
                    message: "the user is deleted"
                })
            }else{ 
                return res.status(404).json({
                    success:false,
                    message: 'user not found'
                }).catch(err=>{
                    return res.status(400).json({
                        success:false,
                        error: err 
                    })
                })
            }
        })
    })

module.exports = router