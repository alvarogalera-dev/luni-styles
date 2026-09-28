import os
import re
import json
from googletrans import Translator
import time

def extract_strings(directory):
    strings = set()
    # Regex to find text between JSX tags > text <
    pattern = re.compile(r'>\s*([^<{]+?)\s*<')
    # Also find text inside quotes for placeholder="", title=""
    # but that's harder. Let's just focus on visible text between tags.
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') and 'Panel' not in root:
                with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                    content = f.read()
                    matches = pattern.findall(content)
                    for match in matches:
                        clean = match.strip()
                        if clean and not clean.isnumeric() and len(clean) > 1:
                            strings.add(clean)
                            
    # Also extract from specific components
    components_dir = os.path.join(os.path.dirname(directory), 'Components')
    for root, _, files in os.walk(components_dir):
        for file in files:
            if file.endswith('.tsx') and file in ['Navbar.tsx', 'Footer.tsx', 'BookingModal.tsx']:
                with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                    content = f.read()
                    matches = pattern.findall(content)
                    for match in matches:
                        clean = match.strip()
                        if clean and not clean.isnumeric() and len(clean) > 1:
                            strings.add(clean)
    
    return list(strings)

def main():
    print("Extracting strings...")
    js_dir = os.path.abspath(os.path.join('resources', 'js', 'Pages'))
    texts = extract_strings(js_dir)
    print(f"Found {len(texts)} strings.")
    
    translator = Translator()
    
    locales = {'en': 'en', 'ru': 'ru', 'cn': 'zh-cn'}
    translations = {'es': {t: t for t in texts}}
    
    for loc, code in locales.items():
        print(f"Translating to {loc}...")
        translations[loc] = {}
        for text in texts:
            try:
                # To avoid rate limiting, we could do bulk translation
                pass
            except Exception as e:
                pass
                
        # Bulk translate
        chunk_size = 50
        for i in range(0, len(texts), chunk_size):
            chunk = texts[i:i+chunk_size]
            try:
                results = translator.translate(chunk, src='es', dest=code)
                for j, res in enumerate(results):
                    translations[loc][chunk[j]] = res.text
            except Exception as e:
                print(f"Error on chunk {i}: {e}")
                for text in chunk:
                    translations[loc][text] = text # fallback
            time.sleep(0.5)
            
    with open('resources/js/translations.json', 'w', encoding='utf-8') as f:
        json.dump(translations, f, ensure_ascii=False, indent=2)
        
    print("Translations generated successfully.")

if __name__ == '__main__':
    main()
