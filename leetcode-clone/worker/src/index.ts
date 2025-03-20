import { createClient } from "redis";
const client = createClient();
async function submitProcess(submission: string) {
    console.log(submission)
    const { problemId, code, language } = JSON.parse(submission);
    console.log(problemId, code, language);
    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    })
    console.log("Finished the process")
}

async function main() {
    try {
        await client.connect();
        while (true) {
            try {
                const submission = await client.brPop("problem", 0);
                await submitProcess(submission.element);
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
}
main();