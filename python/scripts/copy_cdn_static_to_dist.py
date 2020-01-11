
import os
import build_frontend as bf

here = os.path.dirname(os.path.abspath(__file__))
folder_root = os.path.join(here, '..', '..')

c = bf.CopyCdnStaticToDist(folder_root=folder_root)

c.run()

