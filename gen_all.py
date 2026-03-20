import os
base = r'C:\Users\Gabriel\Downloads\omnimarketing-ai'
# Test write
with open(os.path.join(base, 'src', 'components', 'test.txt'), 'w') as f:
    f.write('hello')
print('test ok')
