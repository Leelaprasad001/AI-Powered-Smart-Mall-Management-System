import sys
import pymongo
import threading
from src.logger import logging
from src.exception import CustomException
from multiprocessing import Queue
from src.pipeline.reader_pipeline import CustomData
from src.pipeline.processing_pipeline import ModelPipeline
from src.pipeline.comparision_pipeline import Comparision_dlib,Comparision_pytorch

def connect():
    mongodb_url = "mongodb://localhost:27017/"
    client = pymongo.MongoClient(mongodb_url)
    db = client["Smart_Mall_Management"]
    collection = db["Mall_Data"]
    return collection,client
def start(collection):
    try:
        logging.info("SATARTED")

        # create queue
        frame_queue=Queue()
        face_queue=Queue()
        no_of_cameras=int(input("ENTER NUMBER OF CAMERAS:"))

        # create objects
        reader_obj=CustomData(no_of_cameras,frame_queue)
        predict_obj=ModelPipeline(frame_queue,face_queue)
        comparision_obj=Comparision_dlib(face_queue)
        # comparision_obj=Comparision_pytorch(face_queue)

        # create threads
        frame_reader_thread = threading.Thread(target=reader_obj.read_frames, args=())
        face_predict_thread = threading.Thread(target=predict_obj.predict_face, args=())
        face_comparision_thread = threading.Thread(target=comparision_obj.compare_image_with_dataframe, args=(collection,))
    

        # start threads
        frame_reader_thread.start()
        
        face_predict_thread.start()
        face_comparision_thread.start()

        # join threads
        frame_reader_thread.join()
        frame_queue.put([None,None,None])
        face_predict_thread.join()
        face_comparision_thread.join()


        # Check if queue is empty
        print("Frame Queue is empty:", frame_queue.empty())
        print("Face Queue is empty:", face_queue.empty())

    except Exception as e:
        raise CustomException(e,sys)

if __name__=="__main__":
    collection,client=connect()
    start(collection)
    s=int(input())
    collection.delete_many({})
    client.close()


    # env\Scripts\activate
    # python app.py