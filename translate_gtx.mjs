import fs from 'fs';
import https from 'https';

const outFile = 'resources/js/translations.json';
const translations = JSON.parse(fs.readFileSync(outFile, 'utf8'));
const texts = Object.keys(translations['es']);
const locales = { 'en': 'en', 'ru': 'ru', 'cn': 'zh-CN' };

function translateGtx(text, targetCode) {
    return new Promise((resolve, reject) => {
        if (!text || text.length < 2) return resolve(text);
        
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json && json[0]) {
                        const translated = json[0].map(s => s[0]).join('');
                        resolve(translated);
                    } else {
                        resolve(text);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    for (const [loc, code] of Object.entries(locales)) {
        if (!translations[loc]) translations[loc] = {};
        const pending = texts.filter(t => !translations[loc][t] || translations[loc][t] === t);
        console.log(`Translating to ${loc}... (${pending.length} remaining)`);
        
        for (let i = 0; i < pending.length; i++) {
            const t = pending[i];
            try {
                const res = await translateGtx(t, code);
                translations[loc][t] = res;
                process.stdout.write('.');
            } catch (err) {
                translations[loc][t] = t;
                process.stdout.write(`E(${err.message || err.code || err})`);
            }
            if (i % 10 === 0) {
                fs.writeFileSync(outFile, JSON.stringify(translations, null, 2), 'utf8');
            }
            await new Promise(r => setTimeout(r, 400)); // sleep 400ms
        }
        console.log();
        fs.writeFileSync(outFile, JSON.stringify(translations, null, 2), 'utf8');
    }
    console.log("Translations completed via GTX!");
}

main().catch(console.error);
