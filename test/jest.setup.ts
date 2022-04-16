import client from "./directUsClient";
import collection from "./setup/post.collection.json"
import fields from "./setup/post.fields.json"

module.exports = async () => {

     // Create the collection
     const response = await client.collections.createOne(collection.data);
     // Create the fields for Collection 
    
     await Promise.all(fields.data.map(async (field) => {
            await client.fields.createOne('post', field);
        }));
}

// beforeAll(async () => {

//     // check if collection exists
//     const response = await client.collections.readOne('post');
//     console.log(response);
//     if (!response) {
       
//     }
//     // load test data

// });


// afterAll(async () => {
//     await client.collections.deleteOne("post");
// });


