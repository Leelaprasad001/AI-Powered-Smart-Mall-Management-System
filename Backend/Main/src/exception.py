import sys
from src.logger import logging

# this function is used to get the error message details
def error_message_details(error,error_detail:sys):
    _,_,exc_tb=error_detail.exc_info() # get the traceback object
    file_name=exc_tb.tb_frame.f_code.co_filename # get the file name
    error_message="Error occured in python script name [{0}] at line number [{1}] error message [{2}]".format(file_name,exc_tb.tb_lineno,str(error))
    return error_message


# this is the custom exception class which is used to raise the custom exception and get the error message details 
class CustomException(Exception):
    #  this is the constructor of the class which is used to initialize the error message and error details 
    def __init__(self,error_message,error_detail:sys):
        super().__init__(error_message)
        self.error_message=error_message_details(error_message,error_detail=error_detail)
    #  this is the str method which is used to return the error message 
    def __str__(self):
        return self.error_message     
 