# How it works

This project uses the OpenAI GPT-3 API (specifically, text-davinci-003) and Vercel Edge functions with streaming. It generates 5 cinema recommendations based on the form and user input, sends it to the GPT-3 API via a Vercel Edge function, then streams the response back to the application.

# Running Locally

After cloning the repo, go to OpenAI to make an account and put your API key in a file called `.env`.

For example:

`OPENAI_API_KEY=...`

Then, run the application in the command line and it will be available at http://localhost:5173.

`npm run dev`

# Deploy Instantly on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FStephDietz%2Fwatch-this&env=VITE_OPENAI_API_KEY&envDescription=Open%20AI%20API%20key&demo-title=watchthis.dev&demo-url=https%3A%2F%2Fwatchthis.dev)
