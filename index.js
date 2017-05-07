const { Server } = require('./config');
const app = require('./app');

app.listen(
    Server.port,
    () => console.log(`Server listening on port ${Server.port}`)
);