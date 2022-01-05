var compression = require('compression');

const app = require('express')();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
app.use(compression())

const maxTokens = 900;

app.get('/api', async (request, response) => {
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Connection', 'keep-alive');
    response.setHeader('Cache-Control', 'no-cache');
    response.flushHeaders();

    let prompt = `"""\n# YAML\n# Write a CloudFormation template to create an ${decodeURIComponent(request.query.description)}\n# Use this documentation as a guide\n# https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-guide.html\n\nAWSTemplateFormatVersion: '2010-09-09'\nMetadata:\n  License: Apache-2.0\nDescription: ${decodeURIComponent(request.query.description)}\n`;
    
    //call openai endpoint
    const streamData = await getData(prompt);

    //stream responses back to client.
    for await (const chunk of streamData.body) {
        const chunkRow = chunk.toString();
        const resultRow = chunkRow.split('data: ');

        if (resultRow && resultRow.length > 1) {
            if (resultRow[1].includes('[DONE]') || (resultRow.length > 2 && resultRow[2].includes('[DONE]') > 0)) {
                response.write(`data: [DONE]\n\n`);//end of stream
                response.flush();
                response.end();
            }
            else {
                try {
                    const result = JSON.parse(resultRow[1]);
                    if (result && result.choices && result.choices.length > 0 && result.choices[0].text && result.choices[0].text.length > 0) {
                        response.write(`data: ${result.choices[0].text.split('\n\n')[0]}\n\n`);
                        response.flush();
                    }
                }
                catch(e){}
            }
        }
    }

    response.on('close', () => {
        response.end();
    });

});

const getData = async (p) => {
    const apiCall = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
        body: JSON.stringify({
            "prompt": p,
            "temperature": 0,
            "max_tokens": maxTokens,
            "top_p": 1,
            "echo": true,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "stop": ["\"\"\""],
            "stream": true
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
        },
        method: 'POST'
    });

    return apiCall;
}

module.exports = app;