const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI(); // Automatically reads your GEMINI_API_KEY environment variable

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }], // Enables real-time web search grounding
                systemInstruction: "You are the Finbar Innovations AI Assistant. Answer questions accurately using real-time web search results when necessary."
            }
        });

        const answer = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

        res.json({ success: true, answer, sources });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to fetch real-time answer.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Finbar AI Backend running on port ${PORT}`));