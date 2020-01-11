
import os
import shutil

from .base import Base
from .util import Util


class CopyCdnStaticToDist(Base):
    """
    """

    def __init__(self,
                 folder_root=None,
                 ):
        """
        """
        super().__init__(folder_root=folder_root)

        self.dir_dist_cdn = os.path.join(self.dir_dist, 'cdn')
        if not os.path.exists(self.dir_dist_cdn):
            os.makedirs(self.dir_dist_cdn)

    def run(self):
        """
        """

        print('\nstart build_sfa')

        if not os.path.exists(self.dir_dist):
            print('ERROR: folder dist does not exist')
            return

        # CDN FILES IF ANY
        print('\ncopy cdn files to dist/')

        li_file = [e for e in os.listdir(self.dir_cdn)
                   if os.path.isfile(os.path.join(self.dir_cdn, e))]

        print(f'copy {len(li_file)} file(s) from\n\t{self.dir_cdn}\nto\n\t{self.dir_dist}')
        print('files:')
        for e in li_file:
            src = os.path.join(self.dir_cdn, e)
            dst = os.path.join(self.dir_dist_cdn, e)
            shutil.copy2(src, dst)
            print(f'\t{dst}')

        # # STATIC FILES IF ANY
        # print('\ncopy static files')

        # root_src_dir = self.dir_static
        # root_dst_dir = self.dir_single_file

        # for src_dir, dirs, files in os.walk(root_src_dir):
        #     dst_dir = src_dir.replace(root_src_dir, root_dst_dir, 1)
        #     if not os.path.exists(dst_dir):
        #         os.makedirs(dst_dir)
        #     for file_ in files:
        #         src_file = os.path.join(src_dir, file_)
        #         dst_file = os.path.join(dst_dir, file_)
        #         if os.path.exists(dst_file):
        #             os.remove(dst_file)
        #         shutil.copy(src_file, dst_dir)
        #         print(f'\t{src_file}')

        print(f'\ndone')
