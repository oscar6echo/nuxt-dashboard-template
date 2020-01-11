
import os
import shutil
import base64

from .base import Base
from .util import Util


####################################
# DO NOT USE BEAUTIFUL SOUP
# IT WOULD SEEM NATURAL
# BUT INLINING JS FILES
# BREAKS IN SUBTLE WAYS
####################################


class BuildSingleFile(Base):
    """
    """

    def __init__(self,
                 folder_root=None,
                 ):
        """
        """
        super().__init__(folder_root=folder_root)

    def run(self):
        """
        """

        print('\nstart build_sfa')

        f_temp = self.dir_workspace
        f_final = self.dir_single_file

        for folder in [f_temp, f_final]:
            if os.path.exists(folder):
                shutil.rmtree(folder)
            os.makedirs(folder)

        li_js = [
            'app.js',
            'commons.app.js',
            'runtime.js',
        ]

        # COPY FILES
        print(f'\ncopy files from\n\t{self.dir_dist}\nto\n\t{f_temp}\nfiles:')

        fn = 'index.html'
        src = os.path.join(self.dir_dist, fn)
        dst = os.path.join(f_temp, fn)
        shutil.copy(src, dst)
        print(f'\t{fn}')

        fn = 'favicon.ico'
        src = os.path.join(self.dir_dist, fn)
        dst = os.path.join(f_temp, fn)
        shutil.copy(src, dst)
        print(f'\t{fn}')

        for fn in li_js:
            src = os.path.join(self.dir_dist, '_nuxt', fn)
            dst = os.path.join(f_temp, fn)
            shutil.copy(src, dst)
            print(f'\t{fn}')

            # move up one level too
            print(f'\t\talso copy to dist/{fn}')
            dst = os.path.join(self.dir_dist, fn)
            shutil.copy(src, dst)

        print('\nstart make single file app')

        # LOAD INDEX
        print(f'\tload index.html')
        path = os.path.join(f_temp, 'index.html')
        html = Util.load_text_file(path)

        # LOAD FAVICON
        print(f'\tload favicon.ico')
        path = os.path.join(f_temp, 'favicon.ico')
        data = Util.load_binary_file(path)
        favicon_b64 = base64.b64encode(data).decode('utf-8')
        href_favicon = 'href="data:image/x-icon;base64,' + favicon_b64 + '"'

        # LOAD JS
        print(f'\tload runtime.js')
        path = os.path.join(f_temp, 'runtime.js')
        runtime = Util.load_text_file(path)

        print(f'\tload commons.app.js')
        path = os.path.join(f_temp, 'commons.app.js')
        commons_app = Util.load_text_file(path)

        print(f'\tload app.js')
        path = os.path.join(f_temp, 'app.js')
        app = Util.load_text_file(path)

        def wrap(s):
            return f'\n\n<script> \n\n {s} \n\n </script>\n\n'

        print(f'\n\tinline all elements')
        dic_replace = {
            '<link rel="preload" href="./runtime.js" as="script">': '',
            '<link rel="preload" href="./commons.app.js" as="script">': '',
            '<link rel="preload" href="./app.js" as="script">': '',
            'href="/favicon.ico"': href_favicon,
            '<script type="text/javascript" src="./runtime.js"></script>': wrap(runtime),
            '<script type="text/javascript" src="./commons.app.js"></script>': wrap(commons_app),
            '<script type="text/javascript" src="./app.js"></script>': wrap(app),
        }
        new_html = Util.multiple_replace(dic_replace, html)

        # SINGLE FILE
        path = os.path.join(f_final, 'index.html')
        print(f'\n\toutput single file {path}')
        print(f'\tnb characters = {len(new_html)}')
        Util.save_text_file(path, new_html)

        # CDN FILES IF ANY
        print('\ncopy cdn files')

        li_file = [e for e in os.listdir(self.dir_cdn)
                   if os.path.isfile(os.path.join(self.dir_cdn, e))]

        print(f'copy {len(li_file)} file(s) from\n\t{self.dir_cdn}\nto\n\t{self.dir_single_file}')
        print('files:')
        for e in li_file:
            src = os.path.join(self.dir_cdn, e)
            dst = os.path.join(self.dir_single_file, e)
            shutil.copy2(src, dst)
            print(f'\t{dst}')

        # STATIC FILES IF ANY
        print('\ncopy static files')

        root_src_dir = self.dir_static
        root_dst_dir = self.dir_single_file

        for src_dir, dirs, files in os.walk(root_src_dir):
            dst_dir = src_dir.replace(root_src_dir, root_dst_dir, 1)
            if not os.path.exists(dst_dir):
                os.makedirs(dst_dir)
            for file_ in files:
                src_file = os.path.join(src_dir, file_)
                dst_file = os.path.join(dst_dir, file_)
                if os.path.exists(dst_file):
                    os.remove(dst_file)
                shutil.copy(src_file, dst_dir)
                print(f'\t{src_file}')

        print(f'\ndone')
