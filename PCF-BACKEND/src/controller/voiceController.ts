import { generateResponse } from "../util/genRes.js";

/**
 * Voice agent endpoints for the supplier questionnaire assistant.
 *
 *   POST /api/voice/transcribe  — speech to text via Groq Whisper (multilingual,
 *                                 auto language detection). Uses the existing
 *                                 GROQ_API_KEY, so it works out of the box.
 *   POST /api/voice/speak       — text to speech via Azure Neural TTS. If no Azure
 *                                 key is configured we return useBrowserTts so the
 *                                 frontend falls back to the browser voice. This
 *                                 keeps voice working today and upgrades to cloud
 *                                 quality the moment AZURE_SPEECH_KEY is set.
 *
 * Audio is exchanged as base64 in JSON (bodyParser is configured for 50mb), so
 * there is no multipart/multer wiring to add.
 */

// Node 18+ globals — referenced via globalThis so this compiles regardless of
// the TS DOM lib configuration.
const g: any = globalThis as any;

const GROQ_WHISPER_MODEL = process.env.GROQ_WHISPER_MODEL || "whisper-large-v3";

// Map a detected language code to a sensible Azure neural voice. Falls back to
// English. Extend freely as the supplier base grows.
const AZURE_VOICES: Record<string, { voice: string; lang: string }> = {
    en: { voice: "en-US-JennyNeural", lang: "en-US" },
    hi: { voice: "hi-IN-SwaraNeural", lang: "hi-IN" },
    de: { voice: "de-DE-KatjaNeural", lang: "de-DE" },
    fr: { voice: "fr-FR-DeniseNeural", lang: "fr-FR" },
    es: { voice: "es-ES-ElviraNeural", lang: "es-ES" },
    zh: { voice: "zh-CN-XiaoxiaoNeural", lang: "zh-CN" },
    ja: { voice: "ja-JP-NanamiNeural", lang: "ja-JP" },
    pt: { voice: "pt-BR-FranciscaNeural", lang: "pt-BR" },
    it: { voice: "it-IT-ElsaNeural", lang: "it-IT" },
    ar: { voice: "ar-SA-ZariyahNeural", lang: "ar-SA" },
};

function pickAzureVoice(language?: string): { voice: string; lang: string } {
    const code = (language || "").toLowerCase().split(/[-_]/)[0];
    return AZURE_VOICES[code] || AZURE_VOICES.en;
}

function escapeXml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/** POST /api/voice/transcribe  body: { audio: base64|dataURL, mimeType?, language? } */
export async function transcribe(req: any, res: any) {
    const audio = req.body?.audio;
    if (!audio || typeof audio !== "string") {
        return res.send(generateResponse(false, "No audio provided", 400, null));
    }

    const groqKey = process.env.GROQ_API_KEY?.trim();
    if (!groqKey) {
        // No STT provider configured — tell the client to use the browser recogniser.
        return res.send(generateResponse(true, "ok", 200, { text: "", language: "", useBrowserStt: true }));
    }

    try {
        const base64 = audio.replace(/^data:[^;]+;base64,/, "");
        const buffer = Buffer.from(base64, "base64");
        const mimeType = typeof req.body?.mimeType === "string" ? req.body.mimeType : "audio/webm";
        const language = typeof req.body?.language === "string" ? req.body.language.trim() : "";

        const form = new g.FormData();
        form.append("file", new g.Blob([buffer], { type: mimeType }), "audio.webm");
        form.append("model", GROQ_WHISPER_MODEL);
        form.append("response_format", "verbose_json");
        if (language) form.append("language", language);

        const r = await g.fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: { Authorization: `Bearer ${groqKey}` },
            body: form,
        });
        const data: any = await r.json();
        if (!r.ok) {
            console.error("voice.transcribe groq error:", data);
            return res.send(generateResponse(false, "Could not transcribe audio", 502, null));
        }
        return res.send(
            generateResponse(true, "ok", 200, {
                text: (data?.text ?? "").trim(),
                language: data?.language ?? language ?? "",
                useBrowserStt: false,
            })
        );
    } catch (err: any) {
        console.error("voice.transcribe error:", err?.message || err);
        return res.send(generateResponse(false, "Could not transcribe audio", 500, null));
    }
}

/** POST /api/voice/speak  body: { text, language? } */
export async function speak(req: any, res: any) {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text) {
        return res.send(generateResponse(false, "No text provided", 400, null));
    }
    const language = typeof req.body?.language === "string" ? req.body.language : "";

    const azureKey = process.env.AZURE_SPEECH_KEY?.trim();
    const azureRegion = process.env.AZURE_SPEECH_REGION?.trim();
    if (!azureKey || !azureRegion) {
        // Cloud TTS not configured yet — frontend uses the browser voice instead.
        return res.send(generateResponse(true, "ok", 200, { audio: null, useBrowserTts: true }));
    }

    try {
        // Azure REST TTS: exchange the key for a short-lived token, then post SSML.
        const tokenRes = await g.fetch(
            `https://${azureRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
            { method: "POST", headers: { "Ocp-Apim-Subscription-Key": azureKey } }
        );
        if (!tokenRes.ok) {
            console.error("voice.speak azure token error:", tokenRes.status);
            return res.send(generateResponse(true, "ok", 200, { audio: null, useBrowserTts: true }));
        }
        const token = await tokenRes.text();

        const { voice, lang } = pickAzureVoice(language);
        const ssml = `<speak version='1.0' xml:lang='${lang}'><voice name='${voice}'>${escapeXml(text)}</voice></speak>`;

        const ttsRes = await g.fetch(`https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
                "User-Agent": "EnviGuide-PCF",
            },
            body: ssml,
        });
        if (!ttsRes.ok) {
            console.error("voice.speak azure tts error:", ttsRes.status);
            return res.send(generateResponse(true, "ok", 200, { audio: null, useBrowserTts: true }));
        }
        const arrayBuffer = await ttsRes.arrayBuffer();
        const b64 = Buffer.from(arrayBuffer).toString("base64");
        return res.send(
            generateResponse(true, "ok", 200, { audio: `data:audio/mpeg;base64,${b64}`, useBrowserTts: false })
        );
    } catch (err: any) {
        console.error("voice.speak error:", err?.message || err);
        // Never break the UX — fall back to the browser voice.
        return res.send(generateResponse(true, "ok", 200, { audio: null, useBrowserTts: true }));
    }
}
