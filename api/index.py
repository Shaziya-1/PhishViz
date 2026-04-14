import sys
import os

# Ensure the root directory is in the path so we can import 'backend'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import app

# Vercel needs the app object to be named 'app'
# or we can just export it.
# Flask apps work directly with the Vercel Python runtime.
