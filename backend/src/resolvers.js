const migrator = require('./migration');
const db = migrator.createDatabase();

module.exports = {
    Query: {
        users: (_, { role }) => {
            let query = 'SELECT * FROM users';
            let params = [];

            if (role) {
                query += ' where role = ?';
                params.push(role);
            }
            
            return new Promise((resolve, _) => {
                db.all(query, params, (_, rows) => {
                    resolve(rows)
                });
            });
        },
        user: (_, { id }) => {
            return new Promise((resolve, _) => {
                db.get('SELECT * FROM users WHERE id = ?', id, (_, row) => {
                    resolve(row);
                });
            });
        }
    },
    Mutation: {
        createUser: (_, { name, email, role }) => {
            return new Promise((resolve, _) => {
                db.serialize (() => {
                    let statement = 'INSERT INTO users (name, email, role) VALUES (?, ?, ?)';
                    db.run(statement, [name, email, role]);

                    db.get('SELECT * FROM users ORDER BY id DESC LIMIT 1', [], (_, row) => {
                        resolve(row);
                    });
                });
            });
        },
        updateUser: (_, { id, name, email, role }) => {
            let statement = `UPDATE users SET
                name = COALESCE(?, name),
                email = COALESCE(?, email),
                role = COALESCE(?, role)
                WHERE id = ?
            `;

            let params = [name, email, role, id];

            return new Promise((resolve, _) => {
                db.serialize(() => {
                    db.run(statement, params);

                    db.get('SELECT * FROM users WHERE id = ?', id, (_, row) => {
                        resolve(row);
                    });
                });
            });
        },
        deleteUser: (_, { id }) => {
            return new Promise((resolve, _) => {
                db.serialize(() => {
                    let del = 'DELETE FROM users WHERE id = ?';

                    db.run(del, [id]);

                    db.all('SELECT * FROM users', [], (err, rows) => {
                        resolve(rows)
                    });
                });
            });
        }
    }
};