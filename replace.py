with open("src/components/landing-page.tsx", "r") as f:
    content = f.read()

import re

start_str = '          <div className="grid md:grid-cols-3 gap-6">'
end_str = '          </div>\n        </div>\n\n        {/* FAQ Section */}'

idx1 = content.find(start_str)
idx2 = content.find(end_str)

if idx1 != -1 and idx2 != -1:
    new_content = content[:idx1] + '          <TestimonialCarousel />\n' + content[idx2:]
    with open("src/components/landing-page.tsx", "w") as f:
        f.write(new_content)
    print("Replaced!")
else:
    print("Could not find block.")
