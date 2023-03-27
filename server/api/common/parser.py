import re

def get_first_sentence(html_text):
    def find_split_point(text):
        patterns = [r'<p><br></p>', r'<p></p>', r'<br>']
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.start()
        return -1

    # Find the first sentence ending with a period
    first_period = html_text.find(".")
    if first_period != -1 and first_period <= 100:
        return html_text[:first_period + 1]

    # Find the first line break or paragraph break
    split_point = find_split_point(html_text)
    if split_point != -1 and split_point <= 100:
        return html_text[:split_point]

    # If no suitable breaking point is found, preserve entire words up to 100 characters
    if len(html_text) > 100:
        return html_text[:100].rsplit(" ", 1)[0]

    return html_text

# Test with sample HTML string
html_text = "<p>Here is an example of a sentence with HTML tags. This is another sentence.</p>"
print(get_first_sentence(html_text))
