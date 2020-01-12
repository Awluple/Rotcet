import re

def handle_test_file(func):
    def wrapper_function(instance, filename):
        if re.search('test_*', filename):
            return f'tests/{filename}'
        else:
            returned = func(instance, filename)
            print(returned)
            return returned
    return wrapper_function