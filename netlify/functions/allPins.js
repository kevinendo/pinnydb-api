// Importing the MongoClient class from the mongodb package
const { MongoClient } = require("mongodb");
const querystring = require('querystring');
let HEADERS = {
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin',
  'Content-Type': 'application/json', //optional
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '8640'
}

//This solves the "No ‘Access-Control-Allow-Origin’ header is present on the requested resource."

HEADERS['Access-Control-Allow-Origin'] = '*'
HEADERS['Vary'] = 'Origin'
// Defining the serverless function
exports.handler = async function (event) {
  const { page = 1 } = event.queryStringParameters;
  // Creating a new MongoClient instance with the MongoDB URL from the environment variables
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    // Connecting to the MongoDB server
    await client.connect();
    // Accessing the "mydatabase" database
    const db = client.db("pins");
    // Accessing the "items" collection
    const collection = db.collection("pinnydb");

    // Handling GET requests
    if (event.httpMethod === "GET") {
      // Fetching all items from the collection and converting the result to an array
       let query = {}
      const data = await collection.find(query, { pin_id: 1, pin_name: 1, category: 1, set: 1, main_img: 1, _id: 0}).skip((page-1)*100).limit(100).sort({"pin_id": -1}).toArray();
      // Returning a 200 status code and the fetched data
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    }

    // Handling other HTTP methods
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  } catch (error) {
    // Handling any errors that occur during the execution of the function
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    // Closing the MongoDB client connection
    await client.close();
  }
};