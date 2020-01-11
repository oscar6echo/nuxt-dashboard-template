
import os
import shutil

from .base import Base
from .util import Util


class SelectFramework(Base):
    """
    """

    def __init__(self,
                 folder_root=None,
                 framework='vuetify'
                 ):
        """
        """
        super().__init__(folder_root=folder_root)

        frameworks = ['vuetify', 'bootstrap']
        msg = f'framework must be in {frameworks}'
        assert framework in frameworks, msg

        self.framework = framework

    def run(self):
        """
        """

        print(f'\nstart select framework {self.framework}')

        dir_framework = os.path.join(self.dir_python, 'frameworks', self.framework)

        f_src_components = os.path.join(dir_framework, 'components')
        f_src_layouts = os.path.join(dir_framework, 'layouts')
        f_src_pages = os.path.join(dir_framework, 'pages')

        f_dst_components = os.path.join(self.dir_root, 'components')
        f_dst_layouts = os.path.join(self.dir_root, 'layouts')
        f_dst_pages = os.path.join(self.dir_root, 'pages')

        for src, dst in [
            (f_src_components, f_dst_components),
            (f_src_layouts, f_dst_layouts),
            (f_src_pages, f_dst_pages)
        ]:
            print('')
            bn = os.path.basename(src)
            if os.path.exists(dst):
                print(f'delete current /{bn} folder')
                shutil.rmtree(dst)
            print(f'copy {src} to /{bn}')

            shutil.copytree(src, dst, symlinks=False, ignore=None)

        print(f'\ndone')
