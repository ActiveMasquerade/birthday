const exp = require('express');
const mong = require('mongoose');
const server = exp();
const mongostr = 'mongodb+srv://heel:1234@birthday.82kjwbh.mongodb.net/?retryWrites=true&w=majority&appName=birthday';
const schema = require('./birthday');

// Setting up the foundation of the server and making a connection to MongoDB
mong.connect(mongostr);
server.listen(3000);
server.set('view engine', 'ejs');

// Middleware
server.use(exp.static('static'));
server.use(exp.urlencoded({ extended: true }));
server.use(exp.json()); // Add this line to parse JSON bodies

// Listening to requests
server.get('/', (req, res) => {
    res.render('index');
});

server.get('/all', (req, res) => {
    schema.find().then((result) => {
        res.render('all', { data: result });
    });
});

server.get('/search', (req, res) => {
    res.render('search');
});

server.get('/add', (req, res) => {
    res.render('add');
    console.log(req);
});

server.post('/search', (req, res) => {
    console.log(req.body);
});

server.get('/search/date', (req, res) => {
    res.render('bydate');
});

server.get('/search/name', (req, res) => {
    res.render('byname');
});

server.post('/search/date', (req, res) => {
    schema.find({ 'day': req.body.day, 'month': req.body.month }).then(result => {
        res.render('result', { data: result });
    });
});

server.post('/search/name', (req, res) => {
    schema.find({ 'name': req.body.name }).then(result => {
        res.render('result', { data: result });
    }).catch(err => {
        res.send(err);
    });
});

server.get('/search/:id', (req, res) => {
    const id = req.params.id;
    schema.findById(id).then((result) => {
        res.send(result);
    });
});

server.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    schema.findByIdAndDelete(id).then(result => {
        res.json({ redirect: '/' });
    });
});

server.get('/replace/:id', (req, res) => {
    const id = req.params.id;
    res.render('replace', { id: id });
});

server.put('/replace/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.body); // Log the request body to verify the received data
    schema.findByIdAndUpdate(id, req.body, { new: true }).then(result => {
        res.json({ message: 'Data updated successfully', data: result });
    }).catch(err => {
        res.status(500).send(err);
    });
});

server.post('/add', (req, res) => {
    console.log(req.body);
    const data = new schema(req.body);
    data.save().then((result) => {
        res.redirect('/');
    });
});

server.use((req, res) => {
    res.sendFile('./views/404.html', { root: __dirname });
});
