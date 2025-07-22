import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.post('/api/chat', async (req, res) => {
  const userInput = req.body.message;

  const prompt = `Balas pesan pendaftar. Format JSON: 
{
  "nama": "...",
  "email": "...",
  "telepon": "...",
  "alamat": "...",
  "respond": "..."
}
User: ${userInput}`;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: 'user', content: prompt }],
  });

  const json = JSON.parse(completion.data.choices[0].message.content || '{}');

  const { nama, email, telepon, alamat, respond } = json;

  if (nama && email && telepon && alamat) {
    await supabase.from("pendaftaran").insert({ nama, email, telepon, alamat });
  }

  res.json({ respond });
});

app.get('/', (_, res) => {
  res.send('Server aktif');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server jalan di ${port}`));
