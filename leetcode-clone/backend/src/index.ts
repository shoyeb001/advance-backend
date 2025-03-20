import express from 'express';
import { createClient } from 'redis';

const app = express();
app.use(express.json())
const client = createClient();
app.post("/submit", async (req, res) => {
    console.log(req.body)
    const { pId, code, language } = req.body;
    try {
        await client.lPush("problem", JSON.stringify({ pId, code, language }));
        res.status(200).send("Submitted & process start");
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to store submission")
    }
})
async function main() {
    try {
        await client.connect();
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.log(error);
    }
}
main();