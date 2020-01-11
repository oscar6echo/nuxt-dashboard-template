
import os


class Base:
    """
    """

    def __init__(self,
                 folder_root=None,
                 ):
        """
        """

        if folder_root is None:
            self.here = os.path.abspath(os.path.dirname(__file__))
            self.dir_root = os.path.normpath(os.path.join(self.here, '..', '..', '..'))
        else:
            self.dir_root = os.path.normpath(folder_root)

        self.dir_python = os.path.join(self.dir_root, 'python')

        self.dir_py_package = os.path.join(self.dir_python, 'build_frontend')
        self.dir_workspace = os.path.join(self.dir_python, 'workspace')
        self.dir_single_file = os.path.join(self.dir_python, 'single_file')
        self.dir_final = os.path.join(self.dir_python, 'final')

        self.dir_dist = os.path.join(self.dir_root, 'dist')
        self.dir_cdn = os.path.join(self.dir_root, 'cdn')
        self.dir_static = os.path.join(self.dir_root, 'static')

        for folder in [
                self.dir_workspace,
                self.dir_single_file,
        ]:
            if not os.path.exists(folder):
                os.makedirs(folder)

