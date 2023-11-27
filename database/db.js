var oracledb = require('oracledb');

db = {
    user: 'C##LEO',
    password: 'renataematheus@',
    connectString: 'localhost:1521/xe', 
};

async function open(sql,binds,autoCommit){
  let con = await oracledb.getConnection(db);
  let result = await con.execute(sql,binds,{autoCommit});
  con.release();

  return result;
}

exports.Open = open;