# How it works

This project uses the OpenAI GPT-3 API (specifically, text-davinci-003) and Vercel Edge functions with streaming. It generates 5 cinema recommendations based on the form and user input, sends it to the GPT-3 API via a Vercel Edge function, then streams the response back to the application.

# Running Locally

After cloning the repo, go to OpenAI to make an account and put your API key in a file called `.env`.

For example:

`OPENAI_API_KEY=...`

Then, run the application in the command line and it will be available at http://localhost:5173.

`npm run dev`

# Deploy Instantly on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FStephDietz%2Fwatch-this&env=OPENAI_API_KEY,OMDB_API_KEY&envDescription=Go%20to%20Open%20AI.%20Sign%20up.%20Get%20your%20API%20key.%20%20Enter%20the%20API%20key%20in%20ENV%20Variables%20and%20LFG!!!%20%20%20After%20that%20head%20to%20https%3A%2F%2Fwww.omdbapi.com%2F%20sign%20up%20and%20follow%20the%20instructions%20to%20get%20your%20API%20key.%20Enter%20it%20and%20LFG!!!&envLink=https%3A%2F%2Fplatform.openai.com%2Faccount%2Fapi-keys)
