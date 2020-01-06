def string_list_to_normal(string_list):
    if string_list:
        as_list = string_list.split(',')
    else:
        return []
    for index, value in enumerate(as_list):
        try:
            value = int(value)
        except ValueError:
            raise TypeError(f"An error accured while trying to convert '{value}' to integer'")
        as_list[index] = value # exchange string values to integer
    return as_list