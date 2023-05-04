// Include the AWS SDK module
// const AWS = require('aws-sdk');
// const AWS = require('aws-sdk')
import AWS from 'aws-sdk';

// Instantiate a DynamoDB document client with the SDK
let dynamodb = new AWS.DynamoDB.DocumentClient();
// Use built-in module to get current date & time
let date = new Date();
// Store date and time in human-readable format in a variable
let now = date.toISOString();
// Define handler function, the entry point to our code for the Lambda service
// We receive the object that triggers the function as a parameter
export const  handler = async (event) => {
    // Extract values from event and format as strings
    let name = JSON.stringify(`Hello from Lambda, ${event.firstName} ${event.lastName}`);
    // Create JSON object with parameters for DynamoDB and store in a variable
    let params = {
        TableName:'HelloWorldDatabase',
        Item: {
            'ID': name,
            'LatestGreetingTime': now
        }
    };
    // Using await, make sure object writes to DynamoDB table before continuing execution
    await dynamodb.put(params).promise();
    // Create a JSON object with our response and store it in a constant
    const response = {
        statusCode: 200,
        body: name
    };
    // Return the response constant
    return response;
};