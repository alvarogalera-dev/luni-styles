import json
import os
import time
from deep_translator import GoogleTranslator

# Get pending text and translate
out_file = 'resources/js/translations.json'

with open(out_file, 'r', encoding='utf-8') as f:
    translations = json.load(f)

texts = list(translations['es'].keys())

locales = {'en': 'en', 'ru': 'ru', 'cn': 'zh-CN'}

for loc, code in locales.items():
    if loc not in translations:
        translations[loc] = {}
        
    pending = [t for t in texts if t not in translations[loc] or translations[loc][t] == t]
    print(f"Translating to {loc}... ({len(pending)} remaining)")
    
    translator = GoogleTranslator(source='es', target=code)
    
    # Translate one by one with a small delay
    for i, t in enumerate(pending):
        if not t.strip() or len(t) < 2:
            translations[loc][t] = t
            continue
            
        try:
            res = translator.translate(t)
            translations[loc][t] = res
            print('.', end='', flush=True)
        except Exception as e:
            print('E', end='', flush=True)
            translations[loc][t] = t # Fallback
            
        # Save every 20
        if i % 20 == 0:
            with open(out_file, 'w', encoding='utf-8') as f:
                json.dump(translations, f, ensure_ascii=False, indent=2)
                
        time.sleep(0.3)
        
    print()

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print("Translations completed via Python deep-translator!")
