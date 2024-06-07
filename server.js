const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();  // Импорт dotenv и загрузка переменных окружения
const { HOROSCOPE_PROMPT } = require('./constants');  // Импорт констант
const path = require('path');

const app = express();

app.use(bodyParser.json());

// Обслуживание HTML файла из корня проекта
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-horoscope', async (req, res) => {
    const { day, month, year, position, techStack } = req.body;

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: HOROSCOPE_PROMPT,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,  // Использование переменной окружения
                'Content-Type': 'application/json'
            }
        });

        const horoscope = response.data.choices[0].text.trim();
        res.json({ horoscope });
    } catch (error) {
        console.error('Error generating horoscope:', error);
        res.status(500).json({ error: 'Failed to generate horoscope' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
