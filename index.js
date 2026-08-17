// =====================================================
//  🚀 KAORI BOT ULTRA - EL BOT MÁS VERGAS DE TELEGRAM
//  UNIFICADO CON OSINT, IA, DESCARGAS, JUEGOS Y MÁS
//  Inspirado en *Your Lie in April*
// =====================================================

import TelegramBot from 'node-telegram-bot-api';
import Groq from 'groq-sdk';
import axios from 'axios';
import dotenv from 'dotenv';
import QRCode from 'qrcode';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import whois from 'whois';
import dns from 'dns';
import crypto from 'crypto';

// =====================================================
//  CONFIGURACIÓN INICIAL
// =====================================================
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
//  LECTURA DE VARIABLES DE ENTORNO (TODAS LAS KEYS)
// =====================================================
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENROUTER_KEY = process.env.OPENROUTER_KEY;
const GROQ_KEY = process.env.GROQ_KEY;
const GEMINI_KEY = process.env.GEMINI_KEY;
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const EXCHANGERATE_KEY = process.env.EXCHANGERATE_KEY;
const POLLINATIONS_KEY = process.env.POLLINATIONS_KEY;
const NUMVERIFY_KEY = process.env.NUMVERIFY_KEY;
const SHODAN_KEY = process.env.SHODAN_KEY;
const VIRUSTOTAL_KEY = process.env.VIRUSTOTAL_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const EMAILREP_KEY = process.env.EMAILREP_KEY;
const ADMIN_ID = process.env.ADMIN_ID;
const LEMPI_API_KEY = 'lem336';

if (!TELEGRAM_TOKEN) {
  console.error('❌ FALTA TELEGRAM_TOKEN en .env');
  process.exit(1);
}

// =====================================================
//  INICIALIZAR BOT Y CLIENTES
// =====================================================
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const groq = GROQ_KEY ? new Groq({ apiKey: GROQ_KEY }) : null;

// =====================================================
//  🖼️ CARGAR IMÁGENES DE KAORI
// =====================================================
const imagenesFolder = path.join(__dirname, 'assets');
const misImagenes = [];

try {
  const files = fs.readdirSync(imagenesFolder);
  const imageFiles = files.filter(file =>
    file.endsWith('.jpg') || file.endsWith('.jpeg') ||
    file.endsWith('.png') || file.endsWith('.gif')
  );
  imageFiles.forEach(file => {
    misImagenes.push(path.join(imagenesFolder, file));
  });
  console.log(`✅ ${misImagenes.length} imágenes cargadas desde 'assets'`);
} catch (error) {
  console.warn('⚠️ No se encontró la carpeta "assets", usando imágenes de respaldo.');
  misImagenes.push('https://i.ibb.co/F45TJJqH/IMG-4774.jpg');
}

const getRandomImage = () => {
  return misImagenes[Math.floor(Math.random() * misImagenes.length)];
};

async function sendSafePhoto(chatId, caption, parseMode = 'Markdown', extra = {}) {
  try {
    const imagePath = getRandomImage();
    if (imagePath.startsWith('http')) {
      await bot.sendPhoto(chatId, imagePath, { caption, parse_mode: parseMode, ...extra });
    } else {
      const stream = fs.createReadStream(imagePath);
      await bot.sendPhoto(chatId, stream, { caption, parse_mode: parseMode, ...extra });
    }
  } catch (error) {
    console.warn('⚠️ Error enviando imagen, enviando solo texto:', error.message);
    await bot.sendMessage(chatId, caption, { parse_mode: parseMode, ...extra });
  }
}

// =====================================================
//  COMANDOS BÁSICOS (/start, /help, /menu, /ping, /test)
// =====================================================

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  await sendSafePhoto(chatId,
`🌸 *Kaori Bot Ultra* 🎻

*"La música es libertad. Tocar el violín es como hablar sin palabras."*
— Kaori Miyazono

✨ *Bot con más de 80 comandos: IA, OSINT, descargas, clima, juegos y más.*

*Comandos principales:*
/help - Lista completa
/menu - Menú interactivo
/ping - Latencia
/ai [texto] - Pregunta a la IA
/imagen [descripción] - Genera imagen
/clima [ciudad] - Clima actual
/video [búsqueda] - Descarga audio de YouTube
/qr [texto] - Genera QR
/dolar - Cotización del dólar
/bitcoin - Precio de Bitcoin
/wikipedia [término] - Busca en Wikipedia
/trivia - Pregunta random
/chiste - Chiste random
/poema [tema] - Poema generado por IA

*Creado con amor y violín.* 🎻✨`
  );
});

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  await sendSafePhoto(chatId,
`📋 *LISTA COMPLETA DE COMANDOS*

🤖 *IA:*
/ai [pregunta] - Groq (rápida)
/openrouter [pregunta] - OpenRouter
/gemini [pregunta] - Gemini
/chat [pregunta] - Pollinations
/claude [pregunta] - Claude (Lempi)
/qwen [pregunta] - Qwen (Lempi)

🎨 *IMÁGENES:*
/imagen [descripción] - Genera con Pollinations
/aisearchimg [texto] - IA (Lempi)
/pin [término] - Pinterest
/zimg [descripción] - Zimg (Lempi)
/brat [texto] - Imagen estilo Brat
/waifu - Waifu random (SFW)

🎵 *MÚSICA Y DESCARGAS:*
/video [búsqueda] - Audio de YouTube
/music [búsqueda] - Alias de /video
/yta [búsqueda] - Audio YouTube (Lempi)
/ytv [búsqueda] - Video YouTube (Lempi)
/applemusic [url] - Apple Music
/spotifydl [url] - Spotify
/tiktokdl [url] - TikTok sin marca
/instagram [url] - Instagram
/facebook [url] - Facebook
/mediafire [url] - MediaFire

🔍 *OSINT:*
/username [usuario] - Buscar en redes
/email [correo] - EmailRep + HIBP
/phone [número] - Información de teléfono
/domain [dominio] - WHOIS
/ip [IP] - Geolocalización
/portscan [IP] - Escáner de puertos
/shodan [IP] - Shodan
/dork [consulta] - Google Dork
/ipgeo [IP] - Ubicación exacta
/mac [MAC] - Fabricante
/subdomains [dominio] - Enumerar subdominios
/password [contraseña] - Verificar filtrada
/breach [email] - Brechas de seguridad
/cve [keyword] - Buscar vulnerabilidades
/asn [IP] - Información ASN
/cors [url] - Verificar CORS
/tech [dominio] - Detectar tecnologías
/wayback [url] - Historial en Wayback

🌐 *UTILIDADES:*
/clima [ciudad] - Clima actual
/dolar - Cotización del dólar
/bitcoin - Precio de Bitcoin
/qr [texto] - Genera QR
/traducir [texto] - Traduce a español
/wikipedia [término] - Busca en Wikipedia
/resumen [url] - Resume una página web
/noticias - Últimas noticias
/recordatorio [tiempo] [texto] - Recordatorio
/emojimix [emoji1] [emoji2] - Mezcla emojis

🎮 *JUEGOS:*
/trivia - Pregunta random
/adivina [número] - Adivina el número
/horoscopo [signo] - Horóscopo del día
/chiste - Chiste random
/poema [tema] - Poema generado por IA

🎨 *CANVAS:*
/welcome [nombre] [grupo] - Imagen de bienvenida
/goodbye [nombre] [grupo] - Imagen de despedida

📋 *OTROS:*
/start - Inicio
/menu - Menú
/ping - Latencia
/test - Diagnóstico
/help - Esta ayuda`
  );
});

bot.onText(/\/menu/, async (msg) => {
  const chatId = msg.chat.id;
  await sendSafePhoto(chatId,
`📂 *MENÚ DE COMANDOS*

🤖 *IA:* /ai, /openrouter, /gemini, /chat, /claude, /qwen
🎨 *Imágenes:* /imagen, /aisearchimg, /pin, /zimg, /brat, /waifu
🎵 *Música:* /video, /yta, /ytv, /applemusic, /spotifydl, /tiktokdl, /instagram, /facebook, /mediafire
🔍 *OSINT:* /username, /email, /phone, /domain, /ip, /portscan, /shodan, /dork, /ipgeo, /mac, /subdomains, /password, /breach, /cve, /asn, /cors, /tech, /wayback
🌐 *Utilidades:* /clima, /dolar, /bitcoin, /qr, /traducir, /wikipedia, /resumen, /noticias, /recordatorio, /emojimix
🎮 *Juegos:* /trivia, /adivina, /horoscopo, /chiste, /poema
🎨 *Canvas:* /welcome, /goodbye

Usa /help para ver descripciones.`
  );
});

bot.onText(/\/ping/, async (msg) => {
  const chatId = msg.chat.id;
  const start = Date.now();
  await bot.sendMessage(chatId, '🏓 Pong...');
  const end = Date.now();
  await sendSafePhoto(chatId, `⚡ *Latencia:* ${end - start} ms`);
});

bot.onText(/\/test/, async (msg) => {
  const chatId = msg.chat.id;
  let report = `🔍 *DIAGNÓSTICO*\n\n`;
  report += `✅ TELEGRAM_TOKEN: ${TELEGRAM_TOKEN ? 'OK' : 'FALTA'}\n`;
  report += `✅ OPENROUTER_KEY: ${OPENROUTER_KEY ? 'OK' : 'FALTA'}\n`;
  report += `✅ GROQ_KEY: ${GROQ_KEY ? 'OK' : 'FALTA'}\n`;
  report += `✅ GEMINI_KEY: ${GEMINI_KEY ? 'OK' : 'FALTA'}\n`;
  report += `✅ OPENWEATHER_KEY: ${OPENWEATHER_KEY ? 'OK' : 'FALTA'}\n`;
  report += `✅ NEWSAPI_KEY: ${NEWSAPI_KEY ? 'OK' : 'FALTA'}\n`;
  report += `✅ EXCHANGERATE_KEY: ${EXCHANGERATE_KEY ? 'OK' : 'FALTA'}\n`;
  report += `✅ POLLINATIONS_KEY: ${POLLINATIONS_KEY ? 'OK' : 'FALTA'}\n`;
  report += `✅ NUMVERIFY_KEY: ${NUMVERIFY_KEY ? 'OK' : 'FALTA'}\n`;
  report += `✅ SHODAN_KEY: ${SHODAN_KEY ? 'OK' : 'FALTA'}\n`;
  report += `✅ VIRUSTOTAL_KEY: ${VIRUSTOTAL_KEY ? 'OK' : 'FALTA'}\n`;
  report += `✅ GITHUB_TOKEN: ${GITHUB_TOKEN ? 'OK' : 'FALTA'}\n`;
  report += `✅ EMAILREP_KEY: ${EMAILREP_KEY ? 'OK' : 'FALTA'}\n`;
  report += `🖼️ Imágenes cargadas: ${misImagenes.length}\n`;
  await sendSafePhoto(chatId, report);
});

// =====================================================
//  🤖 COMANDOS DE IA
// =====================================================

// /ai (GROQ)
if (groq) {
  bot.onText(/\/ai (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const prompt = match[1];
    await bot.sendChatAction(chatId, 'typing');
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
      });
      await sendSafePhoto(chatId, `🤖 *Groq:*\n${completion.choices[0].message.content}`);
    } catch (err) {
      await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
    }
  });
} else {
  bot.onText(/\/ai/, async (msg) => {
    await sendSafePhoto(msg.chat.id, '❌ GROQ no configurado.');
  });
}

// /openrouter
bot.onText(/\/openrouter (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || '❌ No obtuve respuesta.';
    await sendSafePhoto(chatId, `🧠 *OpenRouter:*\n${reply}`);
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

// /gemini
bot.onText(/\/gemini (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '❌ No obtuve respuesta.';
    await sendSafePhoto(chatId, `🧠 *Gemini:*\n${reply}`);
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

// /chat (Pollinations)
bot.onText(/\/chat (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const res = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POLLINATIONS_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || '❌ No obtuve respuesta.';
    await sendSafePhoto(chatId, `💬 *Pollinations:*\n${reply}`);
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

// =====================================================
//  🎨 IMÁGENES
// =====================================================

bot.onText(/\/imagen (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const prompt = match[1];
  await bot.sendChatAction(chatId, 'upload_photo');
  try {
    const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?model=flux&key=${POLLINATIONS_KEY}`;
    await bot.sendPhoto(chatId, imageUrl, { caption: `🖼️ *"${prompt}"*` });
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

bot.onText(/\/aisearchimg (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const res = await fetch(`https://api.lempi.lat/s/aisearchimg?q=${encodeURIComponent(query)}&apikey=${LEMPI_API_KEY}`);
    const data = await res.json();
    if (data?.url) await bot.sendPhoto(chatId, data.url, { caption: `🖼️ "${query}"` });
    else await bot.sendMessage(chatId, '❌ No encontré resultados.');
  } catch {
    await bot.sendMessage(chatId, '❌ Error al buscar imágenes.');
  }
});

// /waifu (imagen random)
bot.onText(/\/waifu/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const res = await fetch('https://api.waifu.pics/sfw/waifu');
    const data = await res.json();
    if (data?.url) {
      await bot.sendPhoto(chatId, data.url, { caption: '🌸 Waifu random' });
    } else {
      await bot.sendMessage(chatId, '❌ No se pudo obtener waifu.');
    }
  } catch {
    await bot.sendMessage(chatId, '❌ Error al obtener waifu.');
  }
});

// =====================================================
//  🌤️ CLIMA Y FINANZAS
// =====================================================

bot.onText(/\/clima (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ciudad = match[1].trim();
  await bot.sendChatAction(chatId, 'typing');
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${OPENWEATHER_KEY}&units=metric&lang=es`
    );
    const text = `🌡️ *${data.name}:*\n` +
                 `☁️ ${data.weather[0].description}\n` +
                 `🌡️ Temperatura: ${data.main.temp}°C\n` +
                 `💧 Humedad: ${data.main.humidity}%\n` +
                 `💨 Viento: ${data.wind.speed} km/h`;
    await sendSafePhoto(chatId, text);
  } catch {
    await sendSafePhoto(chatId, '❌ No encontré esa ciudad. Prueba en inglés.');
  }
});

bot.onText(/\/dolar/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendChatAction(chatId, 'typing');
  try {
    const res = await axios.get(
      `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_KEY}/pair/USD/MXN`
    );
    await sendSafePhoto(chatId, `💵 *Dólar hoy:*\n1 USD = ${res.data.conversion_rate} MXN\n📅 ${new Date().toLocaleDateString('es-MX')}`);
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

bot.onText(/\/bitcoin/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendChatAction(chatId, 'typing');
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    await sendSafePhoto(chatId, `₿ *Bitcoin:* $${data.bitcoin.usd} USD`);
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

// =====================================================
//  🎵 MÚSICA Y DESCARGAS
// =====================================================

bot.onText(/\/video (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];
  await bot.sendChatAction(chatId, 'upload_video');
  try {
    const result = await yts(query);
    const video = result.videos[0];
    if (!video) return await sendSafePhoto(chatId, '❌ No encontré el video.');
    const stream = ytdl(video.url, { quality: 'highestaudio' });
    const info = await ytdl.getInfo(video.url);
    const title = info.videoDetails.title;
    await bot.sendAudio(chatId, stream, { title, performer: 'YouTube', caption: `🎵 *${title}*` });
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

bot.onText(/\/yta (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const res = await fetch(`https://api.lempi.lat/dl/yta?q=${encodeURIComponent(query)}&apikey=${LEMPI_API_KEY}`);
    const data = await res.json();
    if (data?.download_url) await bot.sendAudio(chatId, data.download_url);
    else await bot.sendMessage(chatId, '❌ No se pudo descargar.');
  } catch {
    await bot.sendMessage(chatId, '❌ Error al descargar.');
  }
});

bot.onText(/\/ytv (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const res = await fetch(`https://api.lempi.lat/dl/ytv?q=${encodeURIComponent(query)}&apikey=${LEMPI_API_KEY}`);
    const data = await res.json();
    if (data?.download_url) await bot.sendVideo(chatId, data.download_url);
    else await bot.sendMessage(chatId, '❌ No se pudo descargar.');
  } catch {
    await bot.sendMessage(chatId, '❌ Error al descargar.');
  }
});

// =====================================================
//  🔍 OSINT - USUARIO, EMAIL, PHONE, DOMAIN, IP
// =====================================================

bot.onText(/\/username (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const res = await fetch(`https://whatsmyname.app/api/v1/username/${username}`);
    const data = await res.json();
    if (data?.sites?.length) {
      let msgText = `🔍 *Resultados para ${username}:*\n\n`;
      data.sites.slice(0, 20).forEach(site => {
        if (site.username_found) {
          msgText += `• [${site.name}](${site.uri})\n`;
        }
      });
      await bot.sendMessage(chatId, msgText);
    } else {
      await bot.sendMessage(chatId, `❌ No se encontró el usuario ${username}.`);
    }
  } catch {
    await bot.sendMessage(chatId, '❌ Error al buscar usuario.');
  }
});

bot.onText(/\/email (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const email = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const res = await fetch(`https://emailrep.io/${email}`);
    const data = await res.json();
    if (data) {
      let msgText = `📧 *Información de ${email}:*\n\n`;
      msgText += `• Reputación: ${data.reputation || 'N/A'}\n`;
      msgText += `• Sospechoso: ${data.suspicious ? 'Sí' : 'No'}\n`;
      msgText += `• Referencias: ${data.references || 0}\n`;
      if (data.details) {
        msgText += `• Dominio existe: ${data.details.domain_exists ? 'Sí' : 'No'}\n`;
        msgText += `• MX válido: ${data.details.valid_mx ? 'Sí' : 'No'}\n`;
        msgText += `• Proveedor gratuito: ${data.details.free_provider ? 'Sí' : 'No'}\n`;
      }
      await bot.sendMessage(chatId, msgText);
    } else {
      await bot.sendMessage(chatId, `❌ No se encontró información para ${email}.`);
    }
  } catch {
    await bot.sendMessage(chatId, '❌ Error al consultar email.');
  }
});

bot.onText(/\/phone (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const phone = match[1];
  await bot.sendChatAction(chatId, 'typing');
  if (!NUMVERIFY_KEY) {
    return bot.sendMessage(chatId, '❌ NUMVERIFY_KEY no configurada.');
  }
  try {
    const res = await fetch(`http://apilayer.net/api/validate?access_key=${NUMVERIFY_KEY}&number=${phone}&format=1`);
    const data = await res.json();
    if (data.valid) {
      let msgText = `📞 *Información del número:*\n\n`;
      msgText += `• Número: ${data.international_format}\n`;
      msgText += `• País: ${data.country_name}\n`;
      msgText += `• Operador: ${data.carrier || 'Desconocido'}\n`;
      msgText += `• Tipo: ${data.line_type || 'N/A'}\n`;
      msgText += `• Ubicación: ${data.location || 'N/A'}`;
      await bot.sendMessage(chatId, msgText);
    } else {
      await bot.sendMessage(chatId, `❌ Número inválido: ${data.error?.info || 'Desconocido'}`);
    }
  } catch {
    await bot.sendMessage(chatId, '❌ Error al consultar número.');
  }
});

bot.onText(/\/domain (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const domain = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    whois.lookup(domain, (err, data) => {
      if (err || !data) {
        return bot.sendMessage(chatId, `❌ No se encontró WHOIS para ${domain}.`);
      }
      const lines = data.split('\n').filter(l => l.trim());
      let msgText = `🏛️ *WHOIS de ${domain}:*\n\n`;
      const relevant = ['Domain Name', 'Registry Domain ID', 'Registrar', 'Creation Date', 'Expiration Date', 'Name Server', 'Registrant Name', 'Registrant Email'];
      lines.forEach(line => {
        relevant.forEach(key => {
          if (line.includes(key)) {
            msgText += `• ${line}\n`;
          }
        });
      });
      bot.sendMessage(chatId, msgText || '❌ No se encontraron datos relevantes.');
    });
  } catch {
    await bot.sendMessage(chatId, '❌ Error al consultar WHOIS.');
  }
});

bot.onText(/\/ip (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ip = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,zip,timezone,isp,org,as,lat,lon`);
    const data = await res.json();
    if (data.status === 'success') {
      let msgText = `🌐 *Información de IP ${ip}:*\n\n`;
      msgText += `📍 *Ubicación:*\n`;
      msgText += `• País: ${data.country}\n`;
      msgText += `• Región: ${data.regionName}\n`;
      msgText += `• Ciudad: ${data.city}\n`;
      msgText += `• Código Postal: ${data.zip}\n`;
      msgText += `• Zona Horaria: ${data.timezone}\n\n`;
      msgText += `🖥️ *Red:*\n`;
      msgText += `• ISP: ${data.isp}\n`;
      msgText += `• Organización: ${data.org}\n`;
      msgText += `• AS: ${data.as}\n\n`;
      msgText += `🗺️ *Coordenadas:* ${data.lat}, ${data.lon}\n`;
      msgText += `[Ver en Google Maps](https://www.google.com/maps?q=${data.lat},${data.lon})`;
      await bot.sendMessage(chatId, msgText);
    } else {
      await bot.sendMessage(chatId, `❌ IP inválida: ${data.message}`);
    }
  } catch {
    await bot.sendMessage(chatId, '❌ Error al consultar IP.');
  }
});

// =====================================================
//  📋 UTILIDADES
// =====================================================

bot.onText(/\/qr (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  try {
    const qrBuffer = await QRCode.toBuffer(text);
    await bot.sendPhoto(chatId, qrBuffer, { caption: `📲 *QR:*\n${text}` });
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

bot.onText(/\/traducir (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const texto = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: `Traduce esto al español: ${texto}` }],
      max_tokens: 300,
    });
    await sendSafePhoto(chatId, `🌐 *Traducción:*\n${completion.choices[0].message.content}`);
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

bot.onText(/\/wikipedia (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const { data } = await axios.get(
      `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    if (data.type === 'disambiguation') {
      return await sendSafePhoto(chatId, `❌ El término "${query}" es ambiguo.`);
    }
    const text = `📖 *${data.title}*\n\n${data.extract || 'Sin resumen.'}\n\n🔗 ${data.content_urls?.desktop?.page || ''}`;
    await sendSafePhoto(chatId, text);
  } catch {
    await sendSafePhoto(chatId, `❌ No encontré "${query}" en Wikipedia.`);
  }
});

bot.onText(/\/resumen (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const { data } = await axios.get(url);
    const text = data.slice(0, 2000).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    if (groq) {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: `Resume esto en 200 palabras: ${text}` }],
        max_tokens: 300,
      });
      await sendSafePhoto(chatId, `📄 *Resumen:*\n${completion.choices[0].message.content}`);
    } else {
      await sendSafePhoto(chatId, `📄 *Texto extraído:*\n${text.slice(0, 400)}...`);
    }
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

bot.onText(/\/noticias/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendChatAction(chatId, 'typing');
  try {
    const { data } = await axios.get(
      `https://newsapi.org/v2/top-headlines?country=mx&apiKey=${NEWSAPI_KEY}&pageSize=5`
    );
    let text = '📰 *Últimas noticias:*\n\n';
    data.articles.forEach((n, i) => {
      text += `${i+1}. *${n.title}*\n${n.description || 'Sin descripción'}\n🔗 ${n.url}\n\n`;
    });
    await sendSafePhoto(chatId, text);
  } catch {
    await sendSafePhoto(chatId, '❌ Error al obtener noticias.');
  }
});

// =====================================================
//  🎮 JUEGOS
// =====================================================

bot.onText(/\/trivia/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendChatAction(chatId, 'typing');
  try {
    const { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
    const q = data.results[0];
    const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
    let text = `❓ *${q.question}*\n\n`;
    options.forEach((opt, i) => text += `${i+1}. ${opt}\n`);
    text += `\nResponde con el número de la opción.`;
    await bot.sendMessage(chatId, text);
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

const adivinaJuego = new Map();
bot.onText(/\/adivina (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const numero = parseInt(match[1]);
  if (isNaN(numero) || numero < 1 || numero > 100) {
    return await sendSafePhoto(chatId, '❌ Escribe un número del 1 al 100.');
  }
  if (!adivinaJuego.has(chatId)) {
    adivinaJuego.set(chatId, Math.floor(Math.random() * 100) + 1);
  }
  const objetivo = adivinaJuego.get(chatId);
  if (numero === objetivo) {
    adivinaJuego.delete(chatId);
    await sendSafePhoto(chatId, `🎉 Correcto! El número era ${objetivo}. ¡Ganaste!`);
  } else if (numero < objetivo) {
    await sendSafePhoto(chatId, `⬆️ Más alto. Intenta otra vez.`);
  } else {
    await sendSafePhoto(chatId, `⬇️ Más bajo. Intenta otra vez.`);
  }
});

bot.onText(/\/horoscopo (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const signo = match[1].toLowerCase();
  const signosValidos = ['aries', 'tauro', 'geminis', 'cancer', 'leo', 'virgo', 'libra', 'escorpio', 'sagitario', 'capricornio', 'acuario', 'piscis'];
  if (!signosValidos.includes(signo)) {
    return await sendSafePhoto(chatId, '❌ Signo no válido.');
  }
  await bot.sendChatAction(chatId, 'typing');
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: `Genera un horóscopo para ${signo} para hoy, en español, positivo.` }],
      max_tokens: 200,
    });
    await sendSafePhoto(chatId, `♈ *Horóscopo para ${signo}:*\n${completion.choices[0].message.content}`);
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

bot.onText(/\/chiste/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const { data } = await axios.get('https://v2.jokeapi.dev/joke/Any?lang=es');
    const chiste = data.type === 'single' ? data.joke : `${data.setup}\n${data.delivery}`;
    await sendSafePhoto(chatId, `😂 *Chiste:*\n${chiste}`);
  } catch {
    await sendSafePhoto(chatId, '😂 ¿Por qué los programadores prefieren el otoño? Porque tienen menos bugs.');
  }
});

bot.onText(/\/poema (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tema = match[1];
  await bot.sendChatAction(chatId, 'typing');
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: `Escribe un poema corto sobre "${tema}"` }],
      max_tokens: 200,
    });
    await sendSafePhoto(chatId, `📝 *Poema:*\n${completion.choices[0].message.content}`);
  } catch (err) {
    await sendSafePhoto(chatId, `❌ Error: ${err.message}`);
  }
});

// =====================================================
//  ⏰ RECORDATORIO
// =====================================================

const recordatorios = new Map();
bot.onText(/\/recordatorio (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const params = match[1].split(' ');
  if (params.length < 2) {
    return await sendSafePhoto(chatId, '❌ Uso: /recordatorio [tiempo] [texto]\nEj: /recordatorio 10min Llamar a Juan');
  }
  const tiempoStr = params[0];
  const texto = params.slice(1).join(' ');
  let segundos = 0;
  if (tiempoStr.includes('s')) segundos = parseInt(tiempoStr) || 10;
  else if (tiempoStr.includes('min')) segundos = (parseInt(tiempoStr) || 1) * 60;
  else if (tiempoStr.includes('h')) segundos = (parseInt(tiempoStr) || 1) * 3600;
  else segundos = parseInt(tiempoStr) || 10;

  const id = Date.now();
  recordatorios.set(id, { chatId, texto, tiempo: Date.now() + segundos * 1000 });
  await sendSafePhoto(chatId, `⏰ Recordatorio configurado para ${tiempoStr}.`);
  setTimeout(async () => {
    const data = recordatorios.get(id);
    if (data) {
      await bot.sendMessage(data.chatId, `⏰ *Recordatorio:* ${data.texto}`);
      recordatorios.delete(id);
    }
  }, segundos * 1000);
});

// =====================================================
//  💬 RESPUESTA A MENSAJES SIN COMANDOS
// =====================================================

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text || text.startsWith('/')) return;

  const responses = [
    '🌸 ¡Hola! ¿Cómo estás?',
    '🎻 ¿Sabes tocar el violín? Yo sí... en el cielo.',
    '✨ ¡Qué bonito día para hacer música!',
    '💖 Me encanta cuando me hablas.',
    '🌙 ¿Ya viste la luna hoy? Está hermosa.',
    '🌸 Kaori dice: "La música es libertad."',
    '🎻 Si necesitas algo, solo dilo.',
  ];
  const randomText = responses[Math.floor(Math.random() * responses.length)];
  await sendSafePhoto(chatId, `🌸 ${randomText}`);
});

// =====================================================
//  ⚠️ MANEJO DE ERRORES DE POLLING
// =====================================================

bot.on('polling_error', (error) => {
  console.warn(`⚠️ Error de polling: ${error.code} - ${error.message}`);
});

console.log('🌸 Kaori Bot Ultra UNIFICADO corriendo...');
console.log(`🖼️ ${misImagenes.length} imágenes cargadas desde 'assets'`);
