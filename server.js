const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

const helpers = require('./utils/helpers');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });

const session = require('express-session');

const PORT = process.env.PORT || 3002;
const app = express();


const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'SuperSecret',
    cookie: {},
    resave: true,
    rolling: true,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    }),
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);

// turn on connection to db and server

// mongoose.connect(
//     process.env.MONGODB_URI || 'mongodb://localhost:27017/tech_blog',
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     },
//   );

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening on PORT 3002'));
});