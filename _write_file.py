import sys, os
filepath = sys.argv[1]
content = sys.stdin.buffer.read().decode('utf-8')
d = os.path.dirname(filepath)
if d:
    os.makedirs(d, exist_ok=True)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print(f'Written {filepath} ({len(content)} bytes)')
