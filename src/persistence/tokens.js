const db = require('./db');

module.exports = {
  async set(email, service, token) {
    try {
      let query;
      if (token)
        query = 'UPDATE user_table SET '+ service + '_token' + ' = \'' + token + '\' WHERE email = \'' + email + '\';';
      else
        query = 'UPDATE user_table SET '+ service + '_token' + ' = \'\' WHERE email = \'' + email + '\';';
      const { row } = await db.query(query);
      return row[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async find(email, service) {
    const query = 'SELECT '+ service + '_token' + ' FROM user_table ' + ' WHERE email = \'' + email + '\';';
    const { rows } = await db.query(query);
    return rows[0][service];
  },
  async findAll(email) {
    const query = 'SELECT * FROM user_table ' + ' WHERE email = \'' + email + '\';';
    const { rows } = await db.query(query);
    delete rows[0].id
    delete rows[0].email
    delete rows[0].password
    return rows[0];
  },
};