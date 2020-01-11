
import os

import subprocess as sp

from .base import Base


class ServeDirDist(Base):
    """
    """

    def __init__(self,
                 folder_root=None,
                 port=8082):
        """
        """
        super().__init__(folder_root=folder_root)
        self.port = port


    def run(self):
        """
        """
        cmd = 'cd {} && python -m http.server {}'
        cmd = cmd.format(self.dir_dist, self.port)
        print(f'\nrun command:\n{cmd}\n')

        p = sp.Popen(cmd, stdout=sp.PIPE, shell=True, universal_newlines=True)

        output, err = p.communicate()
        print(output)
        if err:
            print(f'ERROR:\n{err}')
