import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';

const jsDir = path.resolve('resources/js/Pages');
const componentsDir = path.resolve('resources/js/Components');
const outFile = 'resources/js/translations.json';

function extractStrings(directory, isComponent = false) {
    let strings = new Set();
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!fullPath.includes('Panel')) {
                const sub = extractStrings(fullPath, isComponent);
                sub.forEach(s => strings.add(s));
            }
        } else if (fullPath.endsWith('.tsx')) {
            if (isComponent && !['Navbar.tsx', 'Footer.tsx', 'BookingModal.tsx'].includes(file)) continue;
            const content = fs.readFileSync(fullPath, 'utf8');
            const pattern = />\s*([^<{]+?)\s*</g;
            let match;
            while ((match = pattern.exec(content)) !== null) {
                let clean = match[1].trim();
                // Filter out non-alphabetic strings or short strings, or simple braces
                if (clean && isNaN(clean) && clean.length > 1 && !clean.includes('{') && !clean.includes('}')) {
                    // Remove consecutive spaces
                    strings.add(clean.replace(/\s+/g, ' '));
                }
            }
            
            // Also grab placeholders
            const placeholderPattern = /placeholder=['"]([^'"]+)['"]/g;
            let pm;
            while ((pm = placeholderPattern.exec(content)) !== null) {
                strings.add(pm[1].trim());
            }
        }
    }
    return Array.from(strings);
}

const manualStrings = [
    "Barbería moderna y peluquería infantil en Alcantarilla, Murcia. Un mismo espacio para el cuidado profesional de toda la familia.",
    "© 2026 Luni Styles. Todos los derechos reservados.",
    "Cortes de pelo infantiles con paciencia y mucho mimo, para los más pequeños.",
    "Cortes, degradados y arreglos de barba en Alcantarilla.",
    "Español", "English", "Русский", "中文",
    "ES", "EN", "RU", "CN"
];

async function translateWithTimeout(text, code, timeoutMs = 15000) {
    return Promise.race([
        translate(text, { from: 'es', to: code }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs))
    ]);
}

async function main() {
    let texts = extractStrings(jsDir);
    let compTexts = extractStrings(componentsDir, true);
    let allTexts = Array.from(new Set([...texts, ...compTexts, ...manualStrings]));
    
    // Sort by length ascending so we don't exceed GET request limits
    allTexts.sort((a, b) => a.length - b.length);
    
    console.log(`Extracted ${allTexts.length} unique strings.`);
    
    const locales = { 'en': 'en', 'ru': 'ru', 'cn': 'zh-CN' };
    
    let translations = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : { 'es': {} };
    if (!translations['es']) translations['es'] = {};
    allTexts.forEach(t => translations['es'][t] = t);
    
    for (const [loc, code] of Object.entries(locales)) {
        if (!translations[loc]) translations[loc] = {};
        
        let pending = allTexts.filter(t => !translations[loc][t] || translations[loc][t] === t); // retry if it failed previously
        console.log(`Translating to ${loc}... (${pending.length} remaining)`);
        
        // BATCHING: join 10 strings with ' ||| '
        const BATCH_SIZE = 10;
        for (let i = 0; i < pending.length; i += BATCH_SIZE) {
            const chunk = pending.slice(i, i + BATCH_SIZE);
            const joinedText = chunk.join(' ||| ');
            
            try {
                const res = await translateWithTimeout(joinedText, code);
                // Depending on the language, ' ||| ' might be translated to ' | | | ' or '|||'.
                // Google Translate is usually good at keeping punctuation.
                let splitRes = res.text.split(/\s*\|\|\|\s*|\|\|\s*\||\|\s*\|\s*\|/);
                
                // If it fails to split correctly, fallback to individual translation
                if (splitRes.length !== chunk.length) {
                    console.log(`Batch split mismatch (${splitRes.length} vs ${chunk.length}). Falling back to individual for this chunk.`);
                    for (const text of chunk) {
                        try {
                            const singleRes = await translateWithTimeout(text, code);
                            translations[loc][text] = singleRes.text;
                        } catch (err) {
                            translations[loc][text] = text;
                        }
                        await new Promise(r => setTimeout(r, 500));
                    }
                } else {
                    for (let j = 0; j < chunk.length; j++) {
                        translations[loc][chunk[j]] = splitRes[j].trim();
                    }
                }
                process.stdout.write('+');
            } catch (err) {
                process.stdout.write('E');
                for (const text of chunk) {
                    translations[loc][text] = text; // fallback on error to continue
                }
            }
            
            fs.writeFileSync(outFile, JSON.stringify(translations, null, 2), 'utf8');
            await new Promise(r => setTimeout(r, 800)); // Delay between batches
        }
    }
    console.log("\nTranslations generated successfully.");
}

main().catch(console.error);
