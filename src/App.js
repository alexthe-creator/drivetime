import React, { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// READING PLAN DATA
// ============================================================
const READING_PLAN = [
  { date: "2026-01-04", ref: "Psalm 89:1-18", theme: "Chosen by God", season: "Christmas" },
  { date: "2026-01-05", ref: "John 15:12-17", theme: "Chosen by God", season: "Christmas" },
  { date: "2026-01-06", ref: "1 Thessalonians 1:2-10", theme: "Chosen by God", season: "Christmas" },
  { date: "2026-01-07", ref: "Isaiah 42:1-9", theme: "Chosen by God", season: "Christmas" },
  { date: "2026-01-08", ref: "Luke 10:1-12", theme: "Chosen by God", season: "Christmas" },
  { date: "2026-01-09", ref: "1 Peter 2:1-10", theme: "Chosen by God", season: "Christmas" },
  { date: "2026-01-10", ref: "Colossians 3:12-17", theme: "Chosen by God", season: "Christmas" },
  { date: "2026-01-11", ref: "Psalm 45", theme: "God's Eternal Purpose", season: "Epiphany" },
  { date: "2026-01-12", ref: "Isaiah 46:5-11", theme: "God's Eternal Purpose", season: "Epiphany" },
  { date: "2026-01-13", ref: "Hebrews 6:9-20", theme: "God's Eternal Purpose", season: "Epiphany" },
  { date: "2026-01-14", ref: "Matthew 19:16-30", theme: "God's Eternal Purpose", season: "Epiphany" },
  { date: "2026-01-15", ref: "Matthew 6:25-34", theme: "God's Eternal Purpose", season: "Epiphany" },
  { date: "2026-01-16", ref: "1 Corinthians 3:10-17", theme: "God's Eternal Purpose", season: "Epiphany" },
  { date: "2026-01-17", ref: "2 Timothy 1:1-14", theme: "God's Eternal Purpose", season: "Epiphany" },
  { date: "2026-01-18", ref: "Psalm 148", theme: "Following Jesus", season: "Epiphany" },
  { date: "2026-01-19", ref: "John 1:35-51", theme: "Following Jesus", season: "Epiphany" },
  { date: "2026-01-20", ref: "Matthew 9:9-13", theme: "Following Jesus", season: "Epiphany" },
  { date: "2026-01-21", ref: "Luke 9:23-27", theme: "Following Jesus", season: "Epiphany" },
  { date: "2026-01-22", ref: "Matthew 10:34-42", theme: "Following Jesus", season: "Epiphany" },
  { date: "2026-01-23", ref: "John 10:22-30", theme: "Following Jesus", season: "Epiphany" },
  { date: "2026-01-24", ref: "Matthew 11:25-30", theme: "Following Jesus", season: "Epiphany" },
  { date: "2026-01-25", ref: "Psalm 131", theme: "The Call of God", season: "Epiphany" },
  { date: "2026-01-26", ref: "Luke 5:1-11", theme: "The Call of God", season: "Epiphany" },
  { date: "2026-01-27", ref: "Jeremiah 1:1-10", theme: "The Call of God", season: "Epiphany" },
  { date: "2026-01-28", ref: "Romans 1:1-7", theme: "The Call of God", season: "Epiphany" },
  { date: "2026-01-29", ref: "1 Peter 1:13-25", theme: "The Call of God", season: "Epiphany" },
  { date: "2026-01-30", ref: "1 Peter 3:8-12", theme: "The Call of God", season: "Epiphany" },
  { date: "2026-01-31", ref: "John 21:15-23", theme: "The Call of God", season: "Epiphany" },
  { date: "2026-02-01", ref: "Psalm 29", theme: "The Power of God's Word", season: "Epiphany" },
  { date: "2026-02-02", ref: "John 1:1-13", theme: "The Power of God's Word", season: "Epiphany" },
  { date: "2026-02-03", ref: "Genesis 1:1-19", theme: "The Power of God's Word", season: "Epiphany" },
  { date: "2026-02-04", ref: "Genesis 1:20-31", theme: "The Power of God's Word", season: "Epiphany" },
  { date: "2026-02-05", ref: "Matthew 9:1-8", theme: "The Power of God's Word", season: "Epiphany" },
  { date: "2026-02-06", ref: "2 Corinthians 12:1-10", theme: "The Power of God's Word", season: "Epiphany" },
  { date: "2026-02-07", ref: "1 Peter 1:3-9", theme: "The Power of God's Word", season: "Epiphany" },
  { date: "2026-02-08", ref: "Psalm 32", theme: "The Meaning of Discipleship", season: "Epiphany" },
  { date: "2026-02-09", ref: "Luke 14:7-14", theme: "The Meaning of Discipleship", season: "Epiphany" },
  { date: "2026-02-10", ref: "Luke 9:57-62", theme: "The Meaning of Discipleship", season: "Epiphany" },
  { date: "2026-02-11", ref: "Luke 14:25-34", theme: "The Meaning of Discipleship", season: "Epiphany" },
  { date: "2026-02-12", ref: "John 6:60-71", theme: "The Meaning of Discipleship", season: "Epiphany" },
  { date: "2026-02-13", ref: "Acts 4:32-37", theme: "The Meaning of Discipleship", season: "Epiphany" },
  { date: "2026-02-14", ref: "Romans 15:1-13", theme: "The Meaning of Discipleship", season: "Epiphany" },
  { date: "2026-02-15", ref: "Psalm 66", theme: "God's Transforming Power", season: "Epiphany" },
  { date: "2026-02-16", ref: "2 Corinthians 3:4-18", theme: "God's Transforming Power", season: "Epiphany" },
  { date: "2026-02-17", ref: "1 Peter 1:13-25", theme: "God's Transforming Power", season: "Epiphany" },
  { date: "2026-02-18", ref: "Hebrews 1:1-4", theme: "God's Transforming Power", season: "Epiphany" },
  { date: "2026-02-19", ref: "Jeremiah 32:16-27", theme: "God's Transforming Power", season: "Epiphany" },
  { date: "2026-02-20", ref: "Luke 9:1-6", theme: "God's Transforming Power", season: "Epiphany" },
  { date: "2026-02-21", ref: "Luke 24:36-53", theme: "God's Transforming Power", season: "Epiphany" },
  { date: "2026-02-22", ref: "Psalm 19", theme: "Getting Ready to Serve", season: "Lent" },
  { date: "2026-02-23", ref: "Luke 16:1-13", theme: "Getting Ready to Serve", season: "Lent" },
  { date: "2026-02-24", ref: "Matthew 20:20-28", theme: "Getting Ready to Serve", season: "Lent" },
  { date: "2026-02-25", ref: "Philippians 2:1-11", theme: "Getting Ready to Serve", season: "Lent" },
  { date: "2026-02-26", ref: "Hebrews 12:12-17", theme: "Getting Ready to Serve", season: "Lent" },
  { date: "2026-02-27", ref: "1 Peter 4:1-11", theme: "Getting Ready to Serve", season: "Lent" },
  { date: "2026-02-28", ref: "John 12:20-36", theme: "Getting Ready to Serve", season: "Lent" },
  { date: "2026-03-01", ref: "Psalm 119:33-48", theme: "What God Has Promised", season: "Lent" },
  { date: "2026-03-02", ref: "1 Kings 8:22-30", theme: "What God Has Promised", season: "Lent" },
  { date: "2026-03-03", ref: "Nehemiah 9:6-25", theme: "What God Has Promised", season: "Lent" },
  { date: "2026-03-04", ref: "Romans 4:16-25", theme: "What God Has Promised", season: "Lent" },
  { date: "2026-03-05", ref: "James 1:1-15", theme: "What God Has Promised", season: "Lent" },
  { date: "2026-03-06", ref: "2 Corinthians 1:12-22", theme: "What God Has Promised", season: "Lent" },
  { date: "2026-03-07", ref: "2 Peter 3:5-13", theme: "What God Has Promised", season: "Lent" },
  { date: "2026-03-08", ref: "Psalm 27", theme: "Meeting God Face to Face", season: "Lent" },
  { date: "2026-03-09", ref: "Genesis 32:22-32", theme: "Meeting God Face to Face", season: "Lent" },
  { date: "2026-03-10", ref: "Exodus 3:1-12", theme: "Meeting God Face to Face", season: "Lent" },
  { date: "2026-03-11", ref: "Isaiah 55", theme: "Meeting God Face to Face", season: "Lent" },
  { date: "2026-03-12", ref: "2 Corinthians 4:1-6", theme: "Meeting God Face to Face", season: "Lent" },
  { date: "2026-03-13", ref: "1 Corinthians 13:1-13", theme: "Meeting God Face to Face", season: "Lent" },
  { date: "2026-03-14", ref: "Romans 8:1-17", theme: "Meeting God Face to Face", season: "Lent" },
];
// NOTE: This includes Jan 4 - Mar 14. For the full year, continue the pattern
// from the BREAD 2026 PDF through Dec 31.

// ============================================================
// BREAD PROMPTS
// ============================================================
const PROMPTS = {
  beStill: "Ask God to fill the space, and then take a moment in stillness. Fix your eyes on Jesus and invite the Holy Spirit to guide your time.",
  secondReading: "Allow the words to settle into your being. As you listen, ask yourself: What word or phrase stands out? What is God saying to me today?",
  encounter: "Meditate on this verse. What comes to mind and how does it make you feel? What do you think God is trying to reveal to you through this verse? Allow him to speak to your heart and mind.",
  apply: "Now, turn your focus outward. Think about how you might be able to apply this to your day. What is the one thing you're going to try and live out today?",
  devote: "Finally, close with a simple prayer of devotion to God. Ask God to fill you afresh and commit your day to him.",
};

const STEPS = ["beStill", "firstReading", "secondReading", "encounter", "apply", "devote", "complete"];
const STEP_LABELS = { beStill: "Be Still", firstReading: "Read", secondReading: "Re-Read", encounter: "Encounter", apply: "Apply", devote: "Devote", complete: "Complete" };

// ============================================================
// TTS HOOK
// ============================================================
function useTTS(voiceName) {
  const synth = window.speechSynthesis;
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const onEndRef = useRef(null);

  const speak = useCallback((text, rate = 1, onEnd) => {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.lang = "en-US";
    if (voiceName) {
      const v = synth.getVoices().find(v => v.name === voiceName);
      if (v) u.voice = v;
    }
    onEndRef.current = onEnd;
    u.onend = () => { setSpeaking(false); setPaused(false); if (onEndRef.current) onEndRef.current(); };
    u.onerror = () => { setSpeaking(false); setPaused(false); if (onEndRef.current) onEndRef.current(); };
    setSpeaking(true);
    setPaused(false);
    synth.speak(u);
  }, [synth, voiceName]);

  const pause = useCallback(() => { synth.pause(); setPaused(true); }, [synth]);
  const resume = useCallback(() => { synth.resume(); setPaused(false); }, [synth]);
  const stop = useCallback(() => { synth.cancel(); setSpeaking(false); setPaused(false); }, [synth]);

  return { speak, pause, resume, stop, speaking, paused };
}

// ============================================================
// CHIME
// ============================================================
function playChime() {
  return new Promise(res => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(830, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(415, ctx.currentTime + 1.5);
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2);
      setTimeout(() => { ctx.close(); res(); }, 2200);
    } catch (e) { res(); }
  });
}

// ============================================================
// VOICE COMMAND HOOK
// ============================================================
function useVoiceCommands(onCommand) {
  const [listening, setListening] = useState(false);
  const [lastHeard, setLastHeard] = useState("");
  const recRef = useRef(null);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  const start = useCallback(() => {
    if (!SR) return;
    const r = new SR();
    r.continuous = true;
    r.interimResults = false;
    r.lang = "en-US";
    r.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
      setLastHeard(t);
      if (t.includes("continue") || t.includes("move on")) onCommand("continue");
      else if (t.includes("pause")) onCommand("pause");
      else if (t.includes("resume") || t.includes("play")) onCommand("resume");
      else if (t.includes("skip")) onCommand("skip");
      else if (t.includes("stop")) onCommand("stop");
      else if (t.includes("read more")) onCommand("readMore");
      else if (t.includes("next newsletter") || t.includes("next email")) onCommand("nextNewsletter");
    };
    r.onend = () => { if (recRef.current) { try { r.start(); } catch(e) {} } };
    r.onerror = () => {};
    r.start();
    recRef.current = r;
    setListening(true);
  }, [SR, onCommand]);

  const stopListening = useCallback(() => {
    if (recRef.current) recRef.current.stop();
    recRef.current = null;
    setListening(false);
  }, []);

  return { listening, lastHeard, start, stop: stopListening, supported: !!SR };
}

// ============================================================
// BOOK CODES FOR API.BIBLE
// ============================================================
const BOOK_CODES = { genesis:"GEN",exodus:"EXO",leviticus:"LEV",numbers:"NUM",deuteronomy:"DEU",joshua:"JOS",judges:"JDG",ruth:"RUT","1 samuel":"1SA","2 samuel":"2SA","1 kings":"1KI","2 kings":"2KI","1 chronicles":"1CH","2 chronicles":"2CH",ezra:"EZR",nehemiah:"NEH",esther:"EST",job:"JOB",psalm:"PSA",psalms:"PSA",proverbs:"PRO",ecclesiastes:"ECC",isaiah:"ISA",jeremiah:"JER",lamentations:"LAM",ezekiel:"EZK",daniel:"DAN",hosea:"HOS",joel:"JOL",amos:"AMO",obadiah:"OBA",jonah:"JON",micah:"MIC",nahum:"NAM",habakkuk:"HAB",zephaniah:"ZEP",haggai:"HAG",zechariah:"ZEC",malachi:"MAL",matthew:"MAT",mark:"MRK",luke:"LUK",john:"JHN",acts:"ACT",romans:"ROM","1 corinthians":"1CO","2 corinthians":"2CO",galatians:"GAL",ephesians:"EPH",philippians:"PHP",colossians:"COL","1 thessalonians":"1TH","2 thessalonians":"2TH","1 timothy":"1TI","2 timothy":"2TI",titus:"TIT",philemon:"PHM",hebrews:"HEB",james:"JAS","1 peter":"1PE","2 peter":"2PE","1 john":"1JN","2 john":"2JN","3 john":"3JN",jude:"JUD",revelation:"REV" };

function buildPassageId(ref) {
  const match = ref.match(/^(\d?\s*\w+)\s+(.+)$/);
  if (!match) return null;
  const book = match[1].toLowerCase().trim();
  const rest = match[2].trim();
  const code = BOOK_CODES[book];
  if (!code) return null;
  if (rest.includes(":")) {
    const [ch, vs] = rest.split(":");
    if (vs.includes("-")) {
      const [s, e] = vs.split("-");
      return `${code}.${ch}.${s}-${code}.${ch}.${e}`;
    }
    if (vs.includes("\u2013")) {
      const [s, e] = vs.split("\u2013");
      return `${code}.${ch}.${s}-${code}.${ch}.${e}`;
    }
    return `${code}.${ch}.${vs}`;
  }
  return `${code}.${rest}`;
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [screen, setScreen] = useState("dashboard");
  const [time, setTime] = useState("");
  const [settings, setSettings] = useState({ speed: 1, bibleSpeed1: 1, bibleSpeed2: 0.8, beStill: 60, threshold: 100, bibleApiKey: process.env.REACT_APP_BIBLE_API_KEY || "", voiceName: "", newsletterApiUrl: process.env.REACT_APP_NEWSLETTER_API_URL || "" });
  const tts = useTTS(settings.voiceName);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    tick();
    const i = setInterval(tick, 30000);
    return () => clearInterval(i);
  }, []);

  const hr = new Date().getHours();
  const greeting = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toISOString().slice(0, 10);
  const todayPlan = READING_PLAN.find(r => r.date === today) || READING_PLAN[0];

  const handleVoiceCmd = useCallback((cmd) => {
    if (cmd === "pause") tts.pause();
    else if (cmd === "resume") tts.resume();
    else if (cmd === "stop") { tts.stop(); setScreen("dashboard"); }
  }, [tts]);

  const voice = useVoiceCommands(handleVoiceCmd);

  if (screen === "bread") return <BREADScreen plan={todayPlan} tts={tts} voice={voice} settings={settings} onBack={() => { tts.stop(); setScreen("dashboard"); }} />;
  if (screen === "newsletters") return <NewsletterScreen tts={tts} voice={voice} settings={settings} onBack={() => { tts.stop(); setScreen("dashboard"); }} />;
  if (screen === "settings") return <SettingsScreen onBack={() => setScreen("dashboard")} settings={settings} onSettings={setSettings} />;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #0f172a, #1e293b)", color: "#f1f5f9", fontFamily: "-apple-system, system-ui, sans-serif", padding: "24px 20px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>DriveTime</h1>
          <p style={{ fontSize: 15, color: "#94a3b8", margin: "4px 0 0" }}>{greeting}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 500, color: "#cbd5e1" }}>{time}</div>
          <button onClick={() => setScreen("settings")} style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, cursor: "pointer", padding: "4px 0" }}>⚙ Settings</button>
        </div>
      </div>

      {tts.speaking && (
        <div style={{ background: "rgba(99,102,241,0.15)", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(99,102,241,0.3)" }}>
          <span style={{ color: "#818cf8" }}>♫</span>
          <span style={{ fontSize: 14, color: "#c7d2fe", flex: 1 }}>Playing...</span>
          <button onClick={tts.paused ? tts.resume : tts.pause} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "#e2e8f0", padding: "6px 14px", cursor: "pointer", fontSize: 14 }}>{tts.paused ? "▶ Resume" : "⏸ Pause"}</button>
          <button onClick={tts.stop} style={{ background: "rgba(239,68,68,0.2)", border: "none", borderRadius: 8, color: "#fca5a5", padding: "6px 14px", cursor: "pointer", fontSize: 14 }}>■ Stop</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <button onClick={() => setScreen("bread")} style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 18, padding: "20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left", width: "100%" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(251,191,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>📖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#f1f5f9" }}>BREAD Devotional</div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>{todayPlan.ref}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>📖 {todayPlan.theme}</div>
          </div>
          <div style={{ color: "#475569", fontSize: 18 }}>›</div>
        </button>

        <button onClick={() => setScreen("newsletters")} style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 18, padding: "20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left", width: "100%" }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>📰</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: "#f1f5f9" }}>Newsletters</div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>Paste content to read aloud</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>FT • Axios Pro Rata</div>
          </div>
          <div style={{ color: "#475569", fontSize: 18 }}>›</div>
        </button>

        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 18, padding: "20px", display: "flex", alignItems: "center", gap: 16, opacity: 0.5 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>📞</div>
          <div><div style={{ fontSize: 17, fontWeight: 600, color: "#f1f5f9" }}>Calls</div><div style={{ fontSize: 14, color: "#94a3b8", marginTop: 2 }}>Coming soon</div></div>
        </div>
      </div>

      <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <button onClick={voice.listening ? voice.stop : voice.start} style={{ background: voice.listening ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)", border: voice.listening ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 20px", color: voice.listening ? "#a5b4fc" : "#64748b", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{voice.listening ? "🎤" : "🎙"}</span>
          {voice.listening ? "Voice active" : "Enable voice"}
        </button>
        {voice.lastHeard && <span style={{ fontSize: 12, color: "#475569" }}>"{voice.lastHeard}"</span>}
      </div>
    </div>
  );
}

// ============================================================
// BREAD SCREEN
// ============================================================
function BREADScreen({ plan, tts, voice, settings, onBack }) {
  const [step, setStep] = useState(0);
  const [silenceLeft, setSilenceLeft] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [started, setStarted] = useState(false);
  const [passageText, setPassageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [translation, setTranslation] = useState("KJV");
  const activeRef = useRef(true);
  const skipBeStillRef = useRef(false);
  const currentStep = STEPS[step];

  useEffect(() => {
    setLoading(true);
    const apiKey = settings?.bibleApiKey;
    if (apiKey) {
      const nivId = "78a9f6124f344018-01";
      const pid = buildPassageId(plan.ref);
      if (pid) {
        fetch(`https://rest.api.bible/v1/bibles/${nivId}/passages/${encodeURIComponent(pid)}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=false`, { headers: { "api-key": apiKey } })
          .then(r => r.json())
          .then(d => {
            if (d.data?.content) { setPassageText(d.data.content.replace(/\s+/g, " ").replace(/¶/g, "").trim()); setTranslation("NIV"); }
            else fallback();
            setLoading(false);
          }).catch(() => fallback());
      } else fallback();
    } else fallback();
    function fallback() {
      fetch(`https://bible-api.com/${encodeURIComponent(plan.ref)}?translation=kjv`)
        .then(r => r.json())
        .then(d => { setPassageText(d.text || "Passage unavailable."); setTranslation("KJV"); setLoading(false); })
        .catch(() => { setPassageText("Could not load passage."); setLoading(false); });
    }
  }, [plan.ref, settings?.bibleApiKey]);

  useEffect(() => {
    if (waiting && voice.lastHeard.includes("continue")) advanceFromWait();
  }, [voice.lastHeard, waiting]);

  useEffect(() => {
    if (!started || step !== 0) return;
    if (voice.lastHeard.includes("continue")) {
      skipBeStillRef.current = true;
      tts.stop();
      setSilenceLeft(0);
      playChime().then(() => { if (activeRef.current) setStep(1); });
    }
  }, [voice.lastHeard]);

  const advanceFromWait = () => {
    if (!waiting) return;
    setWaiting(false);
    playChime().then(() => { if (activeRef.current) setStep(s => s + 1); });
  };

  const skipToNext = () => {
    tts.stop();
    if (currentStep === "beStill") {
      skipBeStillRef.current = true;
      setSilenceLeft(0);
    }
    setWaiting(false);
    playChime().then(() => { if (activeRef.current) setStep(s => s + 1); });
  };

  useEffect(() => {
    if (!started || !activeRef.current) return;
    const s = STEPS[step];
    if (s === "beStill") {
      tts.speak(PROMPTS.beStill, 1, async () => {
        if (!activeRef.current || skipBeStillRef.current) return;
        await playChime();
        const dur = settings?.beStill || 60;
        for (let i = dur; i > 0; i--) { if (!activeRef.current || skipBeStillRef.current) return; setSilenceLeft(i); await new Promise(r => setTimeout(r, 1000)); }
        setSilenceLeft(0); await playChime();
        if (activeRef.current) setStep(1);
      });
    } else if (s === "firstReading") {
      tts.speak(`Today's passage is ${plan.ref}. The theme this week is ${plan.theme}.`, settings?.bibleSpeed1 || 1, () => {
        if (!activeRef.current) return;
        setTimeout(() => { tts.speak(passageText, settings?.bibleSpeed1 || 1, () => { if (activeRef.current) setTimeout(() => setStep(2), 2000); }); }, 1500);
      });
    } else if (s === "secondReading") {
      tts.speak(PROMPTS.secondReading, 1, () => {
        if (!activeRef.current) return;
        setTimeout(() => { tts.speak(passageText, settings?.bibleSpeed2 || 0.8, async () => { if (!activeRef.current) return; await playChime(); if (activeRef.current) setStep(3); }); }, 1500);
      });
    } else if (s === "encounter" || s === "apply" || s === "devote") {
      tts.speak(PROMPTS[s], 1, async () => { if (!activeRef.current) return; await playChime(); setWaiting(true); });
    } else if (s === "complete") {
      tts.speak("Amen. Today's devotional is complete.", 1, () => {});
    }
  }, [step, started]);

  useEffect(() => { voice.start(); return () => voice.stop(); }, []);
  useEffect(() => () => { activeRef.current = false; tts.stop(); }, []);

  const stepColor = (i) => i < step ? "#22c55e" : i === step ? "#818cf8" : "#334155";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #0f172a, #1a1a2e)", color: "#f1f5f9", fontFamily: "-apple-system, system-ui, sans-serif", padding: "24px 20px", boxSizing: "border-box" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 15, cursor: "pointer", padding: 0, marginBottom: 20 }}>← Back</button>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
        {STEPS.filter(s => s !== "complete").map((s, i) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: stepColor(i), border: i === step ? "2px solid #a5b4fc" : "2px solid transparent" }} />
            <span style={{ fontSize: 10, color: i === step ? "#c7d2fe" : "#475569" }}>{STEP_LABELS[s]}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        {!started ? (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>BREAD Devotional</h2>
            <p style={{ color: "#94a3b8", fontSize: 16, margin: "0 0 4px" }}>{plan.ref}</p>
            <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 24px" }}>{plan.theme}</p>
            {loading ? <p style={{ color: "#64748b" }}>Loading passage...</p> : (
              <div>
                <div style={{ fontSize: 13, color: translation === "NIV" ? "#22c55e" : "#f59e0b", marginBottom: 16 }}>
                  {translation === "NIV" ? "✓ NIV translation loaded" : "⚠ Loading KJV..."}
                </div>
                <button onClick={() => { setStarted(true); setStep(0); }} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 16, color: "white", fontSize: 18, fontWeight: 600, padding: "16px 48px", cursor: "pointer" }}>Start Devotional</button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px" }}>{STEP_LABELS[currentStep] || "Complete"}</h2>
            {currentStep !== "complete" && <p style={{ color: "#94a3b8", fontSize: 15, margin: "0 0 24px" }}>{plan.ref}</p>}
            {currentStep === "beStill" && silenceLeft > 0 && (
              <div style={{ margin: "32px auto" }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="#1e293b" strokeWidth="4" />
                  <circle cx="70" cy="70" r="60" fill="none" stroke="#818cf8" strokeWidth="4" strokeDasharray={377} strokeDashoffset={377 * (silenceLeft / (settings?.beStill || 60))} strokeLinecap="round" transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset 1s linear" }} />
                </svg>
                <div style={{ marginTop: -90, fontSize: 32, fontWeight: 300, color: "#e2e8f0" }}>{Math.floor(silenceLeft / 60)}:{String(silenceLeft % 60).padStart(2, "0")}</div>
                <div style={{ marginTop: 48, fontSize: 14, color: "#64748b" }}>Be still...</div>
              </div>
            )}
            {waiting && (
              <div style={{ margin: "40px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎤</div>
                <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 24 }}>Say "continue" when ready</p>
                <button onClick={advanceFromWait} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 14, color: "white", fontSize: 16, fontWeight: 600, padding: "14px 40px", cursor: "pointer" }}>Continue</button>
              </div>
            )}
            {currentStep === "complete" && (
              <div style={{ margin: "40px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
                <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 24 }}>Today's devotional is complete</p>
                <button onClick={onBack} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, color: "#e2e8f0", fontSize: 16, padding: "14px 40px", cursor: "pointer" }}>Back to Dashboard</button>
              </div>
            )}
          </div>
        )}
      </div>
      {started && currentStep !== "complete" && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "20px", display: "flex", justifyContent: "center", gap: 24, background: "linear-gradient(transparent, #0f172a)" }}>
          <button onClick={tts.paused ? tts.resume : tts.pause} style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#e2e8f0", fontSize: 24, cursor: "pointer" }}>{tts.paused ? "▶" : "⏸"}</button>
          <button onClick={skipToNext} style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", fontSize: 24, cursor: "pointer" }}>⏭</button>
          <button onClick={() => { activeRef.current = false; tts.stop(); onBack(); }} style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: 24, cursor: "pointer" }}>■</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// NEWSLETTER SCREEN
// ============================================================
function NewsletterScreen({ tts, voice, settings, onBack }) {
  const [content, setContent] = useState("");
  const [source, setSource] = useState("ft");
  const [playing, setPlaying] = useState(false);
  const [sections, setSections] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [fetchedData, setFetchedData] = useState({ ft: "", axios: "" });
  const threshold = settings?.threshold || 100;
  const activeRef = useRef(true);

  useEffect(() => { voice.start(); return () => voice.stop(); }, []);
  useEffect(() => () => { activeRef.current = false; tts.stop(); }, []);

  useEffect(() => {
    const url = settings?.newsletterApiUrl;
    if (!url) return;
    setFetching(true);
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const next = {
          ft: data.ft?.body || "",
          axios: data.axios?.body || "",
        };
        setFetchedData(next);
        setContent(next[source] || "");
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    if (fetchedData[source]) setContent(fetchedData[source]);
  }, [source]);

  const parseContent = () => {
    const paras = content.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);
    if (source === "axios") {
      return paras.map(p => {
        const amtMatch = p.match(/\$(\d+(?:\.\d+)?)\s*(m|million|b|billion)/i);
        let amount = 0;
        if (amtMatch) { amount = parseFloat(amtMatch[1]); if (amtMatch[2].toLowerCase().startsWith("b")) amount *= 1000; }
        const isVC = /venture|vc|raised|funding|round|series/i.test(p);
        return { text: p, included: !isVC || amount >= threshold, amount, isVC };
      });
    }
    return paras.map(p => ({ text: p, included: true, amount: 0, isVC: false }));
  };

  const readSection = (secs, idx) => {
    if (!activeRef.current) return;
    let i = idx;
    while (i < secs.length && !secs[i].included) i++;
    if (i >= secs.length) { tts.speak("All newsletters complete.", 1, () => setPlaying(false)); return; }
    setCurrentIdx(i);
    tts.speak(secs[i].text, settings?.speed || 1, () => { if (activeRef.current) readSection(secs, i + 1); });
  };

  const startReading = () => { const p = parseContent(); setSections(p); setCurrentIdx(0); setPlaying(true); readSection(p, 0); };
  const skipSection = () => { tts.stop(); if (currentIdx + 1 < sections.length) readSection(sections, currentIdx + 1); else setPlaying(false); };

  useEffect(() => { if (playing && voice.lastHeard.includes("skip")) skipSection(); }, [voice.lastHeard]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #0f172a, #1e293b)", color: "#f1f5f9", fontFamily: "-apple-system, system-ui, sans-serif", padding: "24px 20px", boxSizing: "border-box" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 15, cursor: "pointer", padding: 0, marginBottom: 20 }}>← Back</button>
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 24px" }}>📰 Newsletters</h2>
      {!playing ? (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[["ft", "Financial Times"], ["axios", "Axios Pro Rata"]].map(([k, label]) => (
              <button key={k} onClick={() => setSource(k)} style={{ flex: 1, padding: 12, borderRadius: 12, border: source === k ? "2px solid #6366f1" : "1px solid #334155", background: source === k ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)", color: source === k ? "#c7d2fe" : "#94a3b8", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>{label}</button>
            ))}
          </div>
          {source === "axios" && <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#fbbf24" }}>💡 VC deals under ${threshold}M will be skipped</div>}
          {fetching
            ? <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b", fontSize: 15 }}>Fetching today's newsletter...</div>
            : <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={`Paste your ${source === "ft" ? "Financial Times" : "Axios Pro Rata"} newsletter here...\n\nSeparate sections with blank lines.`} style={{ width: "100%", minHeight: 200, background: "rgba(255,255,255,0.05)", border: "1px solid #334155", borderRadius: 14, padding: 16, color: "#e2e8f0", fontSize: 15, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
          }
          <button onClick={startReading} disabled={!content.trim()} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: content.trim() ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "#1e293b", color: content.trim() ? "white" : "#475569", fontSize: 17, fontWeight: 600, cursor: content.trim() ? "pointer" : "default", marginTop: 16 }}>▶ Start Reading</button>
        </div>
      ) : (
        <div>
          <div style={{ background: "rgba(59,130,246,0.1)", borderRadius: 16, padding: 20, marginBottom: 20, border: "1px solid rgba(59,130,246,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ background: source === "ft" ? "#c08080" : "#3b82f6", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>{source === "ft" ? "Financial Times" : "Axios Pro Rata"}</span>
              <span style={{ fontSize: 13, color: "#64748b" }}>{currentIdx + 1} of {sections.filter(s => s.included).length}</span>
            </div>
            <div style={{ height: 4, background: "#1e293b", borderRadius: 2, marginBottom: 16 }}>
              <div style={{ height: "100%", background: "#6366f1", borderRadius: 2, width: `${((currentIdx + 1) / Math.max(sections.filter(s => s.included).length, 1)) * 100}%`, transition: "width 0.3s" }} />
            </div>
            <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.5, margin: 0, maxHeight: 120, overflow: "hidden" }}>{sections[currentIdx]?.text?.slice(0, 200)}{(sections[currentIdx]?.text?.length || 0) > 200 ? "..." : ""}</p>
          </div>
          {source === "axios" && sections.some(s => !s.included) && <div style={{ fontSize: 13, color: "#f59e0b", marginBottom: 16, textAlign: "center" }}>{sections.filter(s => !s.included).length} deal(s) filtered (under ${threshold}M)</div>}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24 }}>
            <button onClick={tts.paused ? tts.resume : tts.pause} style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "2px solid rgba(99,102,241,0.4)", color: "#a5b4fc", fontSize: 28, cursor: "pointer" }}>{tts.paused ? "▶" : "⏸"}</button>
            <button onClick={skipSection} style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8", fontSize: 28, cursor: "pointer" }}>⏭</button>
            <button onClick={() => { tts.stop(); setPlaying(false); }} style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: 28, cursor: "pointer" }}>■</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SETTINGS SCREEN
// ============================================================
function SettingsScreen({ onBack, settings, onSettings }) {
  const [speed, setSpeed] = useState(settings?.speed || 1);
  const [bibleSpeed1, setBibleSpeed1] = useState(settings?.bibleSpeed1 || 1);
  const [bibleSpeed2, setBibleSpeed2] = useState(settings?.bibleSpeed2 || 0.8);
  const [beStill, setBeStill] = useState(settings?.beStill || 60);
  const [threshold, setThreshold] = useState(settings?.threshold || 100);
  const [newsletterApiUrl, setNewsletterApiUrl] = useState(settings?.newsletterApiUrl || "");
  const [voiceName, setVoiceName] = useState(settings?.voiceName || "");
  const [voices, setVoices] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = () => {
      const available = speechSynthesis.getVoices().filter(v => v.lang.startsWith("en"));
      setVoices(available);
      if (!voiceName && available.length) {
        const preferred = available.find(v => v.name.toLowerCase().includes("samantha"))
          || available.find(v => v.name.toLowerCase().includes("siri"));
        if (preferred) setVoiceName(preferred.name);
      }
    };
    load();
    speechSynthesis.onvoiceschanged = load;
  }, []);

  const saveAll = () => {
    onSettings({ speed, bibleSpeed1, bibleSpeed2, beStill, threshold, bibleApiKey: settings?.bibleApiKey, voiceName, newsletterApiUrl });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #0f172a, #1e293b)", color: "#f1f5f9", fontFamily: "-apple-system, system-ui, sans-serif", padding: "24px 20px", boxSizing: "border-box" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 15, cursor: "pointer", padding: 0, marginBottom: 20 }}>← Back</button>
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 24px" }}>⚙ Settings</h2>

      <SectionBox title="Voice">
        <select value={voiceName} onChange={e => setVoiceName(e.target.value)} style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", padding: "10px 12px", fontSize: 14, marginBottom: 10 }}>
          {voices.map(v => <option key={v.name} value={v.name}>{v.name}{v.localService ? "" : " (online)"}</option>)}
        </select>
        <button onClick={() => { const u = new SpeechSynthesisUtterance("The Lord is my shepherd, I shall not want."); u.rate = speed; const v = voices.find(v => v.name === voiceName); if (v) u.voice = v; speechSynthesis.cancel(); speechSynthesis.speak(u); }} style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, color: "#a5b4fc", padding: "10px 20px", cursor: "pointer", fontSize: 14, width: "100%" }}>🔊 Preview Voice</button>
      </SectionBox>

      <SectionBox title="Reading Speeds">
        <SliderRow label="Newsletters" value={speed} onChange={setSpeed} />
        <SliderRow label="Bible 1st reading" value={bibleSpeed1} onChange={setBibleSpeed1} />
        <SliderRow label="Bible 2nd reading" value={bibleSpeed2} onChange={setBibleSpeed2} />
      </SectionBox>

      <SectionBox title="BREAD Devotional">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
          <span style={{ fontSize: 14, color: "#94a3b8" }}>Be Still duration</span>
          <select value={beStill} onChange={e => setBeStill(+e.target.value)} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", padding: "6px 12px", fontSize: 14 }}>
            <option value={30}>30 sec</option><option value={60}>60 sec</option><option value={90}>90 sec</option><option value={120}>2 min</option>
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
          <span style={{ fontSize: 14, color: "#94a3b8" }}>Translation</span>
          <span style={{ fontSize: 14, color: "#22c55e" }}>NIV (API.Bible)</span>
        </div>
      </SectionBox>

      <SectionBox title="Newsletters">
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px", lineHeight: 1.5 }}>Newsletter API URL (from Google Apps Script)</p>
        <input type="text" value={newsletterApiUrl} onChange={e => setNewsletterApiUrl(e.target.value)} placeholder="https://script.google.com/macros/s/..." style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", padding: "10px 14px", fontSize: 13, fontFamily: "monospace", boxSizing: "border-box", marginBottom: 12 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
          <span style={{ fontSize: 14, color: "#94a3b8" }}>Axios VC threshold</span>
          <select value={threshold} onChange={e => setThreshold(+e.target.value)} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", padding: "6px 12px", fontSize: 14 }}>
            <option value={25}>$25M+</option><option value={50}>$50M+</option><option value={100}>$100M+</option><option value={250}>$250M+</option>
          </select>
        </div>
      </SectionBox>

      <button onClick={saveAll} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: 17, fontWeight: 600, cursor: "pointer", marginBottom: 40 }}>
        {saved ? "✓ Saved!" : "Save Settings"}
      </button>
    </div>
  );
}

function SectionBox({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>{title}</h3>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1e293b", borderRadius: 14, padding: "12px 16px" }}>{children}</div>
    </div>
  );
}

function SliderRow({ label, value, onChange }) {
  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 14, color: "#94a3b8" }}>{label}</span>
        <span style={{ fontSize: 14, color: "#64748b" }}>{value.toFixed(1)}x</span>
      </div>
      <input type="range" min={0.5} max={2} step={0.1} value={value} onChange={e => onChange(+e.target.value)} style={{ width: "100%", accentColor: "#6366f1" }} />
    </div>
  );
}

export default App;