const sqlite3 = require('sqlite3').verbose();

createDatabase = () => {
    var db = new sqlite3.Database(':memory:');

    db.serialize(() => {
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR,
            email VARCHAR,
            role VARCHAR
        )`)

        let insert = db.prepare('INSERT INTO users (name, email, role) VALUES (?, ?, ?)');

        insert.run(['adm', 'adm@gmail.com', 'adm']);

        for (var i = 0; i < 3; i++) {
            insert.run([
                `Fulano ${i}`,
                `fulano+${i}@gmail.com`,
                'org'
            ]);
        }
    });

    return db;
}

module.exports = {
    createDatabase
};