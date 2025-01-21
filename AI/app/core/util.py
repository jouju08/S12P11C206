
def save_file(file, save_mode, file_name):
    with open(f"../files/{file_name}", save_mode) as f:
        f.write(file)

    return "file/path"
