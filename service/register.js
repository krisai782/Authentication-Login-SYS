const AWS = require('aws-sdk');
AWS.config.update({
    region: ''
})
const util = require('./utils/util');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'jinmeister-users';

async function register(userInfo){
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;
    if (!username || !name || !email || !password){
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

   const dynamoUser = await getUser(username.toLowerCase().trim());
 if (dynamoUser && dynamoUser.username){
    return util.buildResponse(401, {
        message: 'username already exists in our database. please choose a different username'
    })
  }
  //LLLLL
  const encryptedPW = bcrypt.hashSync(password.trim(), 10);
  const user = {
      name: name,
      email: email, 
      username: username.toLowerCase().trim(),
      password: encryptedPW
  }
  
  const saveUserResponse = await sarveUser(user);
  if (!saveUserResponse) {
      return util.buildResponse(503, { message: 'Server Error. Please try again later.'});
  }
  
  return util.buildResponse(200, { username: username}); 
}


async function getUser(username) {
     const params = {
        TableName: userTable, 
        key: {
            username: username
        }
     }
     //dd
     return await dynamodb.get(params).promise().then(response =>{
        return response.Item;
    }, error => {
        console.error('There is an error getting user: ', error);
    })
}

async function saveUser(user) {
    const params ={
        TableName: userTable,
        Iteam: user
    }
    return await dynamodb.put(params).promis().then(()=> {
        return true;       
  }, error => {
     console.error('There is an error saving user:', error)
    });
}

module.export.register = register;
