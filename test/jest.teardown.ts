import client from "./directUsClient";
import collection from "./setup/post.collection.json"
import fields from "./setup/post.fields.json"

module.exports = async () => {
    await client.collections.deleteOne("post");
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
//    
// });


