const connectToMongo = require('./db');
const express = require('express');
// const cors = require('cors');
connectToMongo();

const app = express()
const port = process.env.PORT || 3500

app.use(express.json())
// app.use(cors())

app.use('/api/auth', require("./routes/auth"));
app.use('/api/notes', require("./routes/Notes"));

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`)
})