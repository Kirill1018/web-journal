const express = require('express')
const session = require('express-session')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const csrfProt = 'qwerty'
app.use(session({
    secret: csrfProt,
    resave: false,
    saveUninitialized: true
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')))
app.get('/id', (req, res) => res.send({ Id: req.session.Id }))
app.get('/subjects', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'subjects.html')))
app.get('/subject', (req, res) => res.send(req.session.subject))
app.get('/edSubj', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'editing.html')))
app.get('/addSubj', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'addition.html')))
app.get('/groups', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'groups.html')))
app.get('/group', (req, res) => res.send(req.session.group))
app.get('/edGroup', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edGroup.html')))
app.get('/edStudList', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edStudList.html')))
app.get('/creatGroup', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'creatGroup.html')))
app.get('/lessons', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'lessons.html')))
app.get('/lesson', (req, res) => res.send(req.session.lesson))
app.get('/task', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'task.html')))
app.get('/homeworks', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'homeworks.html')))
app.get('/checking', (req, res) => res.send(req.session.checking))
app.get('/work', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'work.html')))
app.get('/homework', (req, res) => res.send(req.session.homework))
app.get('/lookTask', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'lookTask.html')))
app.get('/rating', isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, 'public', 'rating.html')))
app.post('/', express.urlencoded({ extended: false }), (req, res) => { if (req.headers['csrf-prot'] === csrfProt) req.session.regenerate((err) => {
    if (err) { next(err) }
    const body = req.body
    req.session.Id = body.Id
    req.session.username = body.username
    req.session.password = body.password
    req.session.save()
    res.send('вход выполнен')
})
})
app.post('/subject', req => { if (req.headers['csrf-prot'] === csrfProt) {
    req.session.subject = req.body
    req.session.save()
}
})
app.post('/group', req => { if (req.headers['csrf-prot'] === csrfProt) {
    req.session.group = req.body
    req.session.save()
}
})
app.post('/lesson', req => { if (req.headers['csrf-prot'] === csrfProt) {
    req.session.lesson = req.body
    req.session.save()
}
})
app.post('/checking', req => { if (req.headers['csrf-prot'] === csrfProt) {
    req.session.checking = req.body
    req.session.save()
}
})
app.post('/homework', req => { if (req.headers['csrf-prot'] === csrfProt) {
    req.session.homework = req.body
    req.session.save()
}
})
app.listen(81)
function isAuthenticated(req, res, next) {
    const session = req.session
    if (session.username && session.password) { next() }
    else next('route')
}