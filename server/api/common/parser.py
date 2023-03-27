import re
from html.parser import HTMLParser

class HTMLExtract(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.text = []

    def handle_data(self, data):
        self.text.append(data) 

    def get_text(self):
        return ''.join(self.text)

def strip_tags(html):
    s = HTMLExtract()
    s.feed(html)
    return s.get_text()

def get_title(text_string):
    text = strip_tags(text_string)
    first_sentence = ""
    first_line = ""
    char_count = 0

    for index, char in enumerate(text):
        first_sentence += char
        char_count += 1

        if char == ".":
            break

        if char == "\n":
            first_line = first_sentence.rstrip()
            break

        if char_count >= 100:
            first_sentence = text[:index].rsplit(" ", 1)[0]
            break

    return first_sentence or first_line or text[:100]