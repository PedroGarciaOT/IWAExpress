const connection = require('../lib/db');

module.exports = {
    authenticateByUsername,
    authenticateByEmail,
    getAll
};

async function authenticateByUsername({ username, password }) {
    connection.query('SELECT * FROM accounts WHERE username = "' + username + '" AND password = "' + password + '"', function (error, results, fields) {
        if (!results) {
            return null;
        } else {
            if (results.length > 0) {
                return results[0];
            } else {
                return null;
            }
        }
    });
}

async function authenticateByEmail({ email, password }) {
    connection.query('SELECT * FROM accounts WHERE email = "' + email + '" AND password = "' + password + '"', function (error, results, fields) {
        if (!results) {
            return null;
        } else {
            if (results.length > 0) {
                return results[0];
            } else {
                return null;
            }
        }
    });
}

async function getAll() {
    connection.query('SELECT * FROM accounts' , function (error, results, fields) {
        if (!results) {
            return null;
        } else {
            return results;
        }
    });
}