import re

with open('api/index.ts', 'r') as f:
    content = f.read()

# 1. Remove the import { db }
content = content.replace('import { db } from "../src/lib/firebase";\n', '')

# 2. Update firestore import to include what we need
firestore_import_pattern = r"import \{ (.*?) \} from 'firebase/firestore';"
def repl(m):
    existing = m.group(1)
    new_imports = [x.strip() for x in existing.split(',')]
    for req in ['getFirestore', 'initializeFirestore', 'Firestore']:
        if req not in new_imports:
            new_imports.append(req)
    return f"import {{ {', '.join(new_imports)} }} from 'firebase/firestore';"

content = re.sub(firestore_import_pattern, repl, content)

# 3. Add firebase/app import and inline config before `const app = express();`
firebase_inline_code = """
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCcjhKblRgTAf86VS-bhZ3p7Tx8SemO3aA",
  authDomain: "mox-hunter---the-ai-wolf-crm.firebaseapp.com",
  projectId: "mox-hunter---the-ai-wolf-crm",
  storageBucket: "mox-hunter---the-ai-wolf-crm.firebasestorage.app",
  messagingSenderId: "682972820825",
  appId: "1:682972820825:web:ef4f05b6be728613f00848"
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let db: Firestore;
if (typeof window !== 'undefined') {
  try {
    db = initializeFirestore(firebaseApp, {
      experimentalForceLongPolling: true
    });
  } catch (e) {
    db = getFirestore(firebaseApp);
  }
} else {
  db = getFirestore(firebaseApp);
}

"""

content = content.replace('const app = express();', firebase_inline_code + 'const app = express();')

with open('api/index.ts', 'w') as f:
    f.write(content)
