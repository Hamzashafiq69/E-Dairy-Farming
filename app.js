const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const path = require('path');
const errorHandler = require('./helpers/error-handler');
app.use(cors());
app.options('*',cors());

require('dotenv/config');

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
// app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
const staticDirPath = path.join(__dirname, 'public', 'uploads');
app.use('/public/uploads', express.static(staticDirPath));
app.use(errorHandler);

// Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL


app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)





// Database
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'edairy'
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});




// Development
// app.listen(3000, ()=>{
//     // console.log(api)
//     console.log("server is running http://localhost:3000");

// })


// Production
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Express is working on Port " + port)
})