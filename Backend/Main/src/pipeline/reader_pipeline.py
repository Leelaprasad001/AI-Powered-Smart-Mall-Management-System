import sys
import cv2
import time
from src.exception import CustomException
from multiprocessing import Process

class CustomData:
    def __init__(self,no_of_cameras,frame_queue):
        self.frame_queue=frame_queue
        self.no_of_cameras=no_of_cameras
        self.cap_obj=[]


    def capture_frames(self,camera_id):
        try:
            cap=cv2.VideoCapture(camera_id,apiPreference=cv2.CAP_DSHOW)
            self.cap_obj.append(cap)
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                window_name = f"Camera {camera_id}"
                cv2.imshow(window_name, frame)
                self.frame_queue.put([frame,str(camera_id),time.ctime()])
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    for dcap in self.cap_obj:
                        dcap.release()
                    cv2.destroyAllWindows()      
                    break
        except Exception as e:
            raise CustomException(e,sys)
        
    def read_frames(self):
        try:   
            camera_ids =[i for i in range(self.no_of_cameras)]
            process=[]

            # print("Creating processes")
            
            for camera_id in camera_ids:
                p=Process(target=self.capture_frames,args=(camera_id,))
                process.append(p)
                p.start()

            for p in process:
                p.join()

        except Exception as e:
            raise CustomException(e,sys)