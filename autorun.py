import subprocess
import os

subprocess.call(['python3', './server/app.py'])

os.chdir('./client')
subprocess.call(['npm', 'start'])