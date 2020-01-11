
import re


class Util:
    """
    """

    def __init__(self):
        """
        """
        pass

    @staticmethod
    def multiple_replace(dic, text):
        if len(dic) == 0:
            return text

        # Create a regex from the dict keys
        regex = re.compile('(%s)' % '|'.join(map(re.escape, dic.keys())))

        # For each match, lookup corresponding value in dict
        return regex.sub(lambda mo: dic[mo.string[mo.start():mo.end()]], text)

    @staticmethod
    def load_text_file(path):
        """
        """
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content

    @staticmethod
    def load_binary_file(path):
        """
        """
        with open(path, 'rb') as f:
            content = f.read()
        return content

    @staticmethod
    def save_text_file(path, content):
        """
        """
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)



