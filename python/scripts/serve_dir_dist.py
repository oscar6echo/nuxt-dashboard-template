
import os
import build_frontend as bf

here = os.path.dirname(os.path.abspath(__file__))
folder_root = os.path.join(here, '..', '..')

c = bf.ServeDirDist(folder_root=folder_root,
                    port=8081)

c.run()
