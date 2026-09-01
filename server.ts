import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Gemini API client
  let aiClient: GoogleGenAI | null = null;
  function getGenAI(): GoogleGenAI | null {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
    return aiClient;
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Concierge and Guest Assistant endpoint
  app.post('/api/ai/assistant', async (req, res) => {
    try {
      const { message, hotelContext } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Fallback intelligent response if no API key is provided
        return res.json({
          reply: `Welcome to ${hotelContext?.name || 'Aura Grand Luxe'}. As your dedicated luxury concierge, I am delighted to assist with your suite arrangements, private airport transfers, Michelin-starred dining reservations at our rooftop restaurant, or personalized city experiences. How may I craft your perfect stay today?`
        });
      }

      const systemPrompt = `You are the Master Les Clefs d'Or Head Concierge at ${hotelContext?.name || 'Aura Grand Luxe'}, a world-famous 5-star palace hotel.
Address the guest with refined, courteous, and warm palace hospitality.
Information about current hotel:
Name: ${hotelContext?.name}
City: ${hotelContext?.city}, ${hotelContext?.country}
Phone: ${hotelContext?.phone}
Currency: ${hotelContext?.currency}

Help the guest with room selection, personalized recommendations, booking add-ons (spa, chauffeur transfer, private dining), and local itinerary tips.
Keep answers sophisticated, helpful, concise, and beautifully formatted with bullet points where appropriate.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error('AI assistant error:', error);
      res.status(500).json({
        error: 'Failed to generate concierge response',
        details: error.message || String(error)
      });
    }
  });

  // AI Smart Revenue & Dynamic Yield Insights
  app.post('/api/ai/revenue-insights', async (req, res) => {
    try {
      const { occupancyRate, averageDailyRate, revPar, bookingsCount, hotelName } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          insights: [
            `Strong RevPAR performance at ${hotelName}: Consider raising Deluxe room rates by 8% for upcoming weekend demand spikes.`,
            `High suite demand detected: Introduce a complimentary airport transfer upgrade incentive to fill weekday gaps.`,
            `Food & Beverage cross-sell opportunity: 42% of recent guests booked without breakfast; trigger automated €45 morning tasting menu offer.`
          ],
          recommendedRateMultiplier: 1.08,
          confidenceScore: 94
        });
      }

      const prompt = `Analyze hotel performance data for ${hotelName}:
- Occupancy Rate: ${occupancyRate}%
- Average Daily Rate (ADR): €${averageDailyRate}
- RevPAR: €${revPar}
- Total Active Bookings: ${bookingsCount}

Generate 3 high-impact executive revenue recommendations for the General Manager, optimal dynamic rate multiplier, and occupancy forecast. Return valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (error: any) {
      console.error('AI revenue insights error:', error);
      res.status(500).json({
        error: 'Failed to generate revenue analysis',
        details: error.message || String(error)
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Grand Luxe Hospitality Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
