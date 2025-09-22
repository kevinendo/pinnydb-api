// Importing the MongoClient class from the mongodb package
const { MongoClient } = require("mongodb");
const querystring = require('querystring');

// Defining the serverless function
exports.handler = async function (event) {
  const { pin_id = 1 } = event.queryStringParameters;
  // Creating a new MongoClient instance with the MongoDB URL from the environment variables
  const client = new MongoClient("mongodb+srv://figpindb:snorlaX1@cluster0.37hjp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
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
        let query = { pin_id: parseInt(pin_id) };
      const data = await collection.findOne(query);
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