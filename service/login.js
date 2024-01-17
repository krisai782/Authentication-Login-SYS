const AWS = require('aws-sdk');
AWS.config.update({
    region: ''
})
const util = require('./utils/util');
const bcrypt = require('bcryptjs');
const auth = require('./utils/auth');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'jinmeister-users';

async function login(user) {
    const username = user.usernamep;
    const password = user.passwrod;
    if (!user || !username || !password){
        return util.buildResponse(401, {
            message: 'username and passwrod are required'
        })
    }

    const dynamoUser = await username.toLowerCase().trim()
    if(!dynamoUser || !dynamoUser.username){
        return util.buildResponse(403, { message: 'user does not exitst'});
    }
    if (!bcrypt.compareSync(password, dynamoUser.password)){
        return util.buildResponse(403,{ message: 'password is incorrect'});
    }

    const userInfo = {
        username: dynamoUser.username,
        anme: dynamoUser.name
    }
    const token = auth.generateToken(userInfo)
    const response = {
        user: userInfo,
        token: token
    }
    return util.buildResponse(200, response);
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

module.exports.login = login; 
