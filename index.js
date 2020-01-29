const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3000;

const users = [
  {
    id: 2354,
    name: 'Zayaan Camacho',
    email: 'zayaan@demo.com'
  },
  {
    id: 6553,
    name: 'Eliza Mccullough',
    email: 'eliza@demo.com'
  },
  {
    id: 3248,
    name: 'Eloise Wade',
    email: 'eloise@demo.com'
  },
  {
    id: 8729,
    name: 'Ptolemy Cervantes',
    email: 'ptolemy@demo.com'
  }
];

/*****************************
 * 
 * MIDDLEWARE SECTION
 * 
 *****************************/

/* Application level middleware, active for all endpoints */
app.use((req, res, next) => {
  
  const time = new Date().toISOString();
  const ua = req.get('User-Agent');
  const logString = `Req: ${req.method} ${req.path} ${time} ${req.ip} ${ua}\n`;
  console.log(logString);
  fs.appendFile('access-log.txt', logString, function (err) {
    if (err) throw err;
    next(); // remember to call next, otherwise the execution stops  console.log('Updated!');
  });
  
});

function responseLogger(req, res, next)
{
  res.send("Here is a response for you");
  next();
}

function userProvider(req, res, next)
{
  const userId = req.get('user-id');  
  req.userInfo = users.find(user => user.id == userId);
  if(req.userInfo === undefined)
  {
    res.sendStatus(400);
  }

  next();
}

function base64decoder(req, res, next) {
  const encodedValue = req.get('encoded-value');
  if(encodedValue === undefined)
  {
    res.sendStatus(400);
  }

  let buff = Buffer.from(encodedValue, 'base64');  
  let text = buff.toString('utf-8');
  req.encodedValue = text;
  next();
}

/*****************************
 * 
 * ROUTES
 * 
 *****************************/


app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/responselogger', responseLogger, (req, res) => {
  const time = new Date().toISOString();  
  const logString = `Res: ${req.method} ${req.path} ${time}`;
  console.log(logString);
  fs.appendFile('response-log.txt', logString, function (err) {
    if (err) throw err;
    
  });
});

app.get('/header-demo', userProvider, (req, res) => {
  const userInfo = req.userInfo;

  res.json(userInfo);
});


app.get('/basedecoder', base64decoder, (req, res) => {
  console.log(req.encodedValue);
  res.send("OK decoded " + req.encodedValue);
})


app.listen(PORT, () => console.log('Application started at http://localhost:' + PORT));