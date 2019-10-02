const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000

//views
app.set('views', path.resolve(__dirname, '../views'))
app.set('view engine', 'ejs')

//serve statics
app.use('/public', express.static(path.resolve(__dirname,'../public')))

//routes
const mainRoute = require('./routes/index')
app.use(mainRoute)

app.listen(PORT, () => {
    console.log('app listening on port: ' + ' ' + PORT )
})


