const registerService = require('./service/register');
const loginService = require('./service/login');
const verifyService = require('./service/verify');
const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';

exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;

    switch (true) {
        case event.httpMethod.toUpperCase() === 'GET' && event.path === healthPath:
            response = util.buildResponse(200);
            break;
        case event.httpMethod.toUpperCase() === 'POST' && event.path === registerPath:
            try {
                const registerBody = JSON.parse(event.body);
                response = await registerService.register(registerBody);
            } catch (error) {
                console.error('Error processing registration:', error);
                response = util.buildResponse(500, 'Internal Server Error');
            }
            break;
        case event.httpMethod.toUpperCase() === 'POST' && event.path === loginPath:
            try {
                const loginBody = JSON.parse(event.body);
                response = await loginService.login(loginBody);
            } catch (error) {
                console.error('Error processing login:', error);
                response = util.buildResponse(500, 'Internal Server Error');
            }
            break;
        case event.httpMethod.toUpperCase() === 'POST' && event.path === verifyPath:
            try {
                const verifyBody = JSON.parse(event.body);
                response = verifyService.verify(verifyBody);
            } catch (error) {
                console.error('Error processing verification:', error);
                response = util.buildResponse(500, 'Internal Server Error');
            }
            break;
        default:
            response = util.buildResponse(404, '404 Not Found');
    }

    return response;
};

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };
}
