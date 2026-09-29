import fs from 'fs';

const outFile = 'resources/js/translations.json';
const translations = JSON.parse(fs.readFileSync(outFile, 'utf8'));
const texts = Object.keys(translations['es']);
const locales = { 'en': 'en', 'ru': 'ru', 'cn': 'zh-CN' };

async function translateChrome(text, targetCode) {
    if (!text || text.length < 2) return text;
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=es&tl=${targetCode}&q=${encodeURIComponent(text)}`;
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        });
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        if (data && data.length > 0) {
            return data[0];
        }
        return text;
    } catch (err) {
        throw err;
    }
}

async function main() {
    for (const [loc, code] of Object.entries(locales)) {
        if (!translations[loc]) translations[loc] = {};
        
        // Find strings that are either missing OR exactly equal to the Spanish source (meaning they failed previously)
        const pending = texts.filter(t => !translations[loc][t] || translations[loc][t] === t);
        console.log(`Translating to ${loc}... (${pending.length} remaining)`);
        
        for (let i = 0; i < pending.length; i++) {
            const t = pending[i];
            try {
                const res = await translateChrome(t, code);
                translations[loc][t] = res;
                process.stdout.write('.');
            } catch (err) {
                translations[loc][t] = t;
                process.stdout.write('E');
            }
            if (i % 10 === 0) {
                fs.writeFileSync(outFile, JSON.stringify(translations, null, 2), 'utf8');
            }
            await new Promise(r => setTimeout(r, 600)); // sleep 600ms
        }
        console.log();
        fs.writeFileSync(outFile, JSON.stringify(translations, null, 2), 'utf8');
    }
    console.log("Translations completed via Chrome Extension API!");
}

main().catch(console.error);
