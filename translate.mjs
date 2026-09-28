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
                if (clean && isNaN(clean) && clean.length > 1 && !clean.includes('{') && !clean.includes('}')) {
                    strings.add(clean.replace(/\s+/g, ' '));
                }
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
    "Español", "English", "Русский", "中文"
];

async function translateWithTimeout(text, code, timeoutMs = 5000) {
    return Promise.race([
        translate(text, { from: 'es', to: code }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutMs))
    ]);
}

async function main() {
    let texts = extractStrings(jsDir);
    let compTexts = extractStrings(componentsDir, true);
    let allTexts = Array.from(new Set([...texts, ...compTexts, ...manualStrings]));
    
    const locales = { 'en': 'en', 'ru': 'ru', 'cn': 'zh-CN' };
    
    let translations = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : { 'es': {} };
    allTexts.forEach(t => translations['es'][t] = t);
    
    for (const [loc, code] of Object.entries(locales)) {
        if (!translations[loc]) translations[loc] = {};
        
        let pending = allTexts.filter(t => !translations[loc][t]);
        console.log(`Translating to ${loc}... (${pending.length} remaining)`);
        
        for (let i = 0; i < pending.length; i++) {
            const text = pending[i];
            try {
                const res = await translateWithTimeout(text, code);
                translations[loc][text] = res.text;
                process.stdout.write('.');
            } catch (err) {
                process.stdout.write('E');
                translations[loc][text] = text; // fallback on error to continue
            }
            if (i % 20 === 0) {
                fs.writeFileSync(outFile, JSON.stringify(translations, null, 2), 'utf8');
            }
            await new Promise(r => setTimeout(r, 100)); // prevent spamming
        }
        fs.writeFileSync(outFile, JSON.stringify(translations, null, 2), 'utf8');
    }
    console.log("\nTranslations generated successfully.");
}

main().catch(console.error);
