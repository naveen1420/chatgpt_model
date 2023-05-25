import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'
import {Configuration,OpenAIApi} from 'openai';
var port;
port=process.env.PORT || 80;

dotenv.config();
const configuration =new Configuration({
    apiKey:process.env.OPENAI_API_KEY,
});
console.log(process.env.OPENAI_API_KEY)
const openai=new OpenAIApi(configuration);
const app=express();
app.use(cors());
app.use(express.json());

app.get('/',async(req,res)=>{
    res.status(200).send({
        message:'Server is running successfully',
    })
});

app.post('/',async(req,res)=>{
    try{
        const prompt=req.body.prompt;
        const response=await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.5,
            max_tokens: 3900,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        res.status(200).send({
            bot:response.data.choices[0].text
        });

    }
    catch(error){
        console.log(error);
        res.status(500).send({error,process.env.OPENAI_API_KEY})   
    }
})
app.listen(port);
