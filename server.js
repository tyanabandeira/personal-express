const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://demo:demo@cluster0.kebnqjt.mongodb.net/demo?retryWrites=true&w=majority";
const dbName = "mood-tracker";




MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if(error) {
      throw error;
  }
  db = client.db(dbName);
  console.log("Connected to `" + dbName + "`!");
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/messages', (req, res) => {
  db.collection('messages').insertOne({name: req.body.name, 
    msg: req.body.msg, 
    intentions: req.body.intentions, 
    grateful: req.body.grateful, 
    affirmations: req.body.affirmations, 
    text: req.body.text, feeling: null}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/smile', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name}, {
    $set: {
      feeling: 'smile'
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
app.put('/frown', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name}, {
    $set: {
      feeling: 'frown'
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

app.listen(3000, () => {
console.log('listening on 3000')
});