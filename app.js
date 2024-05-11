import express from "express";
import user from "./models/user.js";
import passport from "passport";
import localStrategy from "passport-local";
import expressSession from "express-session";
import flash from "connect-flash";
import { Server } from "socket.io";
import { createServer } from 'node:http';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json())
app.use(flash());

////////////////////////////////////////////////////////////
passport.use(new localStrategy(user.authenticate()));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "hey"
}))

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
    res.render("start.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs", { existsError: req.flash('error') });
});

app.post("/register", (req, res, next) => {
    const userData = new user({
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname
    });
    console.log(req.body);
    user.register(userData, req.body.password, (err) => {
        if (err) {
            // If the error is due to a duplicate username
            if (err.name === 'UserExistsError') {
                req.flash("error", "Username already exists.");
                return res.redirect('/register');
            }
        }
        // Registration successful
        passport.authenticate("local")(req, res, () => {
            res.redirect("/home");
        })
    })
})


app.get("/login", (req, res) => {
    res.render("login.ejs", { error: req.flash("error") });
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
}), function (req, res) {
})

app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

app.get("/home", isLoggedIn, (req, res) => {
    const username = req.session.passport.user;
    res.redirect("/home/" + username);
});

app.get("/home/:username", isLoggedIn, (req, res) => {
    if(req.params.username !== req.session.passport.user){
        res.redirect("/login");
    }
    else{
        res.render("home.ejs");
    }
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}
//socket io code//////////////////////////////////////////

io.on('connection', (socket) => {
    console.log('a user connected :'+ socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected :'+ socket.id);
      });
  });

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      socket.broadcast.emit('chat message', msg);
    });
  });

//////////////////////////////////////////////////////////

server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

