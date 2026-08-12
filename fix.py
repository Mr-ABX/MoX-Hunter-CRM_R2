with open("src/components/landing-page.tsx", "r") as f:
    content = f.read()

bad_str = "          <TestimonialCarousel />\n          </div>\n        </div>"
good_str = "          <TestimonialCarousel />\n        </div>"

if bad_str in content:
    with open("src/components/landing-page.tsx", "w") as f:
        f.write(content.replace(bad_str, good_str))
    print("Fixed!")
else:
    print("Not found!")
