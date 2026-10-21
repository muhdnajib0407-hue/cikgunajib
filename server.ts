import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Helper for rule-based sentence evaluation fallback
function ruleBasedEvaluation(sentence: string, idiom: string, idiomData?: any) {
  const cleanSentence = sentence.trim().toLowerCase();
  const cleanIdiom = idiom.toLowerCase();
  const words = cleanSentence.split(/\s+/).filter(Boolean);

  const containsIdiom = cleanSentence.includes(cleanIdiom);

  if (!cleanSentence) {
    return {
      status: 'bimbingan',
      markah: 20,
      pujian: 'Cuba bina ayat menggunakan peribahasa kebersihan!',
      maklumBalas: `Sila masukkan ayat yang mengandungi peribahasa "${idiom}". Anda boleh gunakan bantuan blok perkataan di bawah.`,
      cadanganAyat: `Siti seorang yang ${idiom} kerana rajin menyapu sampah di kelas.`,
      kriteria: { adaSimpulanBahasa: false, panjangMencukupi: false, konteksSesuai: false }
    };
  }

  if (!containsIdiom) {
    return {
      status: 'bimbingan',
      markah: 40,
      pujian: 'Usaha yang bagus! Mari masukkan peribahasa kebersihan.',
      maklumBalas: `Ayat anda belum ada peribahasa "${idiom}". Pastikan anda memasukkan "${idiom}" ke dalam ayat berkaitan amalan kebersihan.`,
      cadanganAyat: `Penduduk kampung ${idiom} semasa membersihkan parit dan longkang.`,
      kriteria: { adaSimpulanBahasa: false, panjangMencukupi: words.length >= 4, konteksSesuai: false }
    };
  }

  if (words.length < 4) {
    return {
      status: 'baik',
      markah: 65,
      pujian: 'Bagus! Simpulan bahasa sudah betul!',
      maklumBalas: `Simpulan bahasa "${idiom}" berjaya digunakan. Boleh tambahkan subjek atau penerangan supaya ayat lebih lengkap dan menarik.`,
      cadanganAyat: `Abang bersikap ${idiom} dengan menolong ibu mengemas ruang tamu.`,
      kriteria: { adaSimpulanBahasa: true, panjangMencukupi: false, konteksSesuai: true }
    };
  }

  // Good sentence
  return {
    status: 'cemerlang',
    markah: 95,
    pujian: '🌟 Wah, cemerlang sekali! Ayat anda sangat mantap!',
    maklumBalas: `Penggunaan simpulan bahasa "${idiom}" sangat tepat dengan maksudnya dan struktur ayat tersusun dengan jelas. Tahniah!`,
    cadanganAyat: sentence,
    kriteria: { adaSimpulanBahasa: true, panjangMencukupi: true, konteksSesuai: true }
  };
}

// API: Evaluate sentence with Gemini AI or intelligent pedagogical rule engine
app.post('/api/eval-sentence', async (req, res) => {
  const { sentence, idiom, meaning, contextKeywords } = req.body;

  if (!sentence || !idiom) {
    return res.status(400).json({ error: 'Ayat dan simpulan bahasa diperlukan.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Anda ialah guru pakar Pendidikan Khas Bahasa Melayu (MBPK) di Malaysia.
Murid MBPK (Murid Berkeperluan Pendidikan Khas) membina ayat menggunakan simpulan bahasa:
- Simpulan Bahasa: "${idiom}"
- Maksud Sebenar: "${meaning || ''}"
- Ayat murid: "${sentence}"

Nilaikan ayat ini dengan penuh kasih sayang, motivasi tinggi, dan bahasa Melayu yang mudah difahami oleh kanak-kanak berkeperluan khas.
Berikan output HANYA dalam format JSON berikut (tanpa markdown blok):
{
  "status": "cemerlang" ATAU "baik" ATAU "bimbingan",
  "markah": nombor antara 40 hingga 100,
  "pujian": "Kata-kata pujian mesra dan ceria (cth: Hebatnya kamu!, Bagus sekali usaha adik!)",
  "maklumBalas": "Penerangan ringkas dan mudah sama ada simpulan bahasa digunakan secara betul dalam konteks ayat",
  "cadanganAyat": "Contoh ayat yang lengkap dan mudah jika perlu diperbaiki atau ayat murid jika sudah cemerlang",
  "kriteria": {
    "adaSimpulanBahasa": true/false,
    "panjangMencukupi": true/false,
    "konteksSesuai": true/false
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim() || '';
      try {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch {
        // if JSON parsing fails from raw LLM output, use clean regex or fallback
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json(parsed);
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to rule-based evaluation:', err);
    }
  }

  // Graceful rule-based fallback
  const result = ruleBasedEvaluation(sentence, idiom);
  return res.json(result);
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SIMBA server running on http://localhost:${PORT}`);
  });
}

startServer();
