from langchain_core.output_parsers import BaseOutputParser


class Parser(BaseOutputParser):
    def parse(self, output):
        # print(output)
        # Split the output into lines
        lines = output.strip().split("\n")
        # Filter out empty lines and extract the content after the numbering
        sentences = [line.split(". ", 1)[1] for line in lines if ". " in line]
        return sentences
