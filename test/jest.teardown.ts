import client from "./directUsClient";
import collection from "./setup/post.collection.json"
import fields from "./setup/post.fields.json"

module.exports = async () => {
    await client.collections.deleteOne("post");
}


