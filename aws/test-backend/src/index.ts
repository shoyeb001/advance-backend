import express from 'express';

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({ message: 'This backend is hosted in aws' });
});

async function main() {
    try {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    } catch (error) {
        console.log(error);
    }
}
main();