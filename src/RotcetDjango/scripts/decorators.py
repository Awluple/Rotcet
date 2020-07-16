import re

def handle_test_file(func):
    def wrapper_function(instance, filename):
        if re.match('test_+', filename):
            return f'tests/{filename}'
        else:
            returned = func(instance, filename)
            return returned
    return wrapper_function