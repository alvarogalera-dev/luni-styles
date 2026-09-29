import json
import urllib.request
import urllib.parse
import time
import os

out_file = 'resources/js/translations.json'

with open(out_file, 'r', encoding='utf-8') as f:
    translations = json.load(f)

texts = list(translations['es'].keys())
locales = {'en': 'en', 'ru': 'ru', 'cn': 'zh-CN'}

def translate_mymemory_batch(text_chunk, target):
    joined = " ||| ".join(text_chunk)
    if len(joined) > 490:
        return None # too long to batch
        
    url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(joined)}&langpair=es|{target}&de=info@barberialuni.com"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode())
            if data['responseStatus'] == 200:
                return data['responseData']['translatedText']
            return None
    except Exception as e:
        return None

for loc, code in locales.items():
    if loc not in translations:
        translations[loc] = {}
        
    pending = [t for t in texts if t not in translations[loc] or translations[loc][t] == t]
    
    # Sort by length so we can batch smaller strings easily
    pending.sort(key=len)
    
    print(f"Translating to {loc}... ({len(pending)} remaining)")
    
    i = 0
    while i < len(pending):
        chunk = []
        chunk_len = 0
        
        # Build a batch under 450 chars
        while i < len(pending) and chunk_len + len(pending[i]) + 5 < 450:
            if not pending[i].strip() or len(pending[i]) < 2:
                translations[loc][pending[i]] = pending[i]
                i += 1
                continue
                
            chunk.append(pending[i])
            chunk_len += len(pending[i]) + 5
            i += 1
            
        if not chunk:
            continue
            
        if len(chunk) == 1:
            res = translate_mymemory_batch(chunk, code)
            if res and "MYMEMORY WARNING" not in res:
                translations[loc][chunk[0]] = res
                print('.', end='', flush=True)
            else:
                print('E', end='', flush=True)
                translations[loc][chunk[0]] = chunk[0]
        else:
            res = translate_mymemory_batch(chunk, code)
            if res and "MYMEMORY WARNING" not in res:
                import re
                split_res = re.split(r'\s*\|\|\|\s*|\|\|\s*\||\|\s*\|\s*\|', res)
                if len(split_res) == len(chunk):
                    for j, c in enumerate(chunk):
                        translations[loc][c] = split_res[j].strip()
                    print('+', end='', flush=True)
                else:
                    print('X', end='', flush=True)
                    # Fallback single
                    for c in chunk:
                        s_res = translate_mymemory_batch([c], code)
                        if s_res and "MYMEMORY WARNING" not in s_res:
                            translations[loc][c] = s_res
                        else:
                            translations[loc][c] = c
                        time.sleep(0.3)
            else:
                print('E', end='', flush=True)
                for c in chunk:
                    translations[loc][c] = c
                    
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(translations, f, ensure_ascii=False, indent=2)
            
        time.sleep(0.5)
        
    print()

print("Translations completed via MyMemory BATCH!")
