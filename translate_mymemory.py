import json
import urllib.request
import urllib.parse
import time

out_file = 'resources/js/translations.json'

with open(out_file, 'r', encoding='utf-8') as f:
    translations = json.load(f)

texts = list(translations['es'].keys())
locales = {'en': 'en', 'ru': 'ru', 'cn': 'zh-CN'}

def translate_mymemory(text, target):
    # Split large texts just in case, but mymemory handles up to 500 chars well
    if len(text) > 499:
        return text # Skip very long ones for safety, though mymemory limit is 500
        
    url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(text)}&langpair=es|{target}&de=admin@lunistyles.com"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            if data['responseStatus'] == 200:
                return data['responseData']['translatedText']
            else:
                return None
    except Exception as e:
        return None

for loc, code in locales.items():
    if loc not in translations:
        translations[loc] = {}
        
    pending = [t for t in texts if t not in translations[loc] or translations[loc][t] == t]
    print(f"Translating to {loc}... ({len(pending)} remaining)")
    
    for i, t in enumerate(pending):
        if not t.strip() or len(t) < 2:
            translations[loc][t] = t
            continue
            
        res = translate_mymemory(t, code)
        if res and "MYMEMORY WARNING" not in res:
            translations[loc][t] = res
            print('.', end='', flush=True)
        else:
            print('E', end='', flush=True)
            translations[loc][t] = t
            
        if i % 10 == 0:
            with open(out_file, 'w', encoding='utf-8') as f:
                json.dump(translations, f, ensure_ascii=False, indent=2)
                
        time.sleep(0.5)
        
    print()

with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print("Translations completed via MyMemory!")
