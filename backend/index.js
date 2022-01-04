const AWS = require('aws-sdk')

exports.handler = async (event, context) => {
    let body, statusCode = 400;
    const headers = {
        'Content-Type':'application/json'
    };

    if (event.description && event.description.length > 0) {
        let p = `"""\n# YAML\n# Write a CloudFormation template to create an ${event.description}\n# Use this documentation as a guide\n# https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-guide.html\n\nAWSTemplateFormatVersion: '2010-09-09'\nMetadata:\n  License: Apache-2.0\nDescription: ${event.description}\n`;
        let stop = false;
        let result = {};
        let gptRes = {};
        const maxTokens = 150;
        let c = Math.floor(maxTokens / 10);//max retry
        while (!stop) {
          if (c === 0) {
            break;
          }
          c = c - 1;
          gptRes = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            body: JSON.stringify({
              "prompt": p,
              "temperature": 0,
              "max_tokens": maxTokens,
              "top_p": 1,
              "echo": true,
              "frequency_penalty": 0,
              "presence_penalty": 0,
              "stop": ["\"\"\""]
            }),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
            },
            method: 'POST'
          });
          result = await gptRes.json();
    
          if (result && result.choices && result.choices.length > 0) {
            if(result.choices[0].finish_reason && result.choices[0].finish_reason === 'length' && result.choices[0].text && result.choices[0].text.length > 0) {
              p = result.choices[0].text;//update prompt
            }
            else {
              stop = true;
            }
          }
        }

        if (result && result.choices && result.choices.length > 0 && result.choices[0].text) {
            return {
                statusCode = 200,
                body = {
                    template: result.choices[0].text.split('\n\n')[1]
                },
                headers
            }
        }
        return {
            statusCode = 200,
            body = { template: 'Error' },
            headers
        }
    }
    else {
        statusCode = 401
    }




    return {
        statusCode,
        body,
        headers
    }
}