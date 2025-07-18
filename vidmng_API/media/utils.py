import os

def delete_file(path):
    if path and os.path.isfile(path.path):
        os.remove(path.path)
