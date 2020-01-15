import os
import glob


print('start analyze_dist')


here = os.path.dirname(__file__)
dist = os.path.join(here, '..', '..', 'dist')


def analyze_type(ext):
    """
    """

    print('\n')
    print('-'*20, ext.upper())
    li_path = glob.glob(dist+f'/**/*.{ext}', recursive=True)

    print(f'nb {ext} files = {len(li_path)}')

    dic = {}
    for path in li_path:
        # print('\t', path)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        if not content in dic:
            dic[content] = []
        dic[content].append(path)

    print(f'nb unique content = {len(dic.keys())}')
    print(f'\nnb files for content:')
    for k, e in enumerate(dic.keys()):
        print(f'\tfile#{k+1}\tnb characters={len(e)}')
        for f in dic[e]:
            print(f'\t\t{f}')

    print(f'\ndone {ext}')


analyze_type('html')
analyze_type('js')
