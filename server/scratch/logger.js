const fs = require('fs');
const path = require('path');

const logToFile = (msg) => {
  const logPath = path.join(__dirname, 'debug.log');
  fs.appendFileSync(logPath, `${new Date().toISOString()} - ${msg}\n`);
};

// ... inside addMessage ...
logToFile(`addMessage called for ${req.params.id}`);
logToFile(`User: ${req.user.name}, Role: ${req.user.role}`);
// ...
