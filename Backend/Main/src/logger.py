import logging 
import os
from datetime import datetime
# logger.py is used to create a logger object which is used to log the information in the log file

# this is the path where the logs will be stored
LOG_FILE=f"{datetime.now().strftime('%m_%d_%Y_%H_%M_%S')}.log"
logs_path=os.path.join(os.getcwd(),"logs",LOG_FILE)
os.makedirs(logs_path,exist_ok=True)


# this is the function which is used to get the logger object 
LOG_FILE_PATH=os.path.join(logs_path,LOG_FILE)
logging.basicConfig(
    filename=LOG_FILE_PATH,
    level=logging.INFO,
    # format stores the format of the log message
    format="[%(asctime)s] %(lineno)d %(name)s - %(levelname)s - %(message)s",
)