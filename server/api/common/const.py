SPECIAL_CHARACTERS = [
    '!', '"', '#', '$',
    '%', '&', "'", '(', ')',
    '*', '+', ',', '-',
    '.', '/', ':', ';', '<',
    '=', '>', '?', '@', '[', 
    '\\', ']', '^', '_',
]
# remove later
# from api.common.const import SPECIAL_CHARACTERS

"""
remove later
def set_title2(content):
    try:
        for i in range(50):
            if content[i] == " ":
                if content[i - 1] == ".":
                    return content[:i]
        for i in range(50, 200):
            if content[i] == " ":
                if content[i - 1] in SPECIAL_CHARACTERS:
                    if content[i -1] == ".":
                        return content[:i]
                    return content[:i - 1]
                return content[:i]
    except IndexError:
        return content[:50]
"""