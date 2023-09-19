import cv2
import sys
import os
import uuid
from ultralytics import YOLO
from src.logger import logging
from src.exception import CustomException


class ModelPipeline:
    def __init__(self,frame_queue,face_queue):
        self.frame_queue=frame_queue
        self.face_queue=face_queue
        self.face_model=YOLO("./artifacts/yolov8n-face.pt")

    def is_blurry(self,image, threshold=100):
        try:
            gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            lap_var = cv2.Laplacian(gray_image, cv2.CV_64F).var()
            return lap_var < threshold
        
        except Exception as e:
            raise CustomException(e,sys)

    def predict_face(self):
        try:
            while True:
                frame,camera_id,timestamp=self.frame_queue.get()
                print("got frame")
                if frame is None:
                    self.face_queue.put([None,None,None])
                    break
                face_res=self.face_model.predict(frame)
                face_prediction = face_res[0]
                for face_box in face_prediction.boxes:
                    cords = face_box.xyxy[0].tolist()
                    cords = [round(x) for x in cords]
                    roi=frame[cords[1]:cords[3], cords[0]:cords[2]]
                    if self.is_blurry(roi,100):
                        cv2.imwrite(os.path.join("artifacts/blurry",str(uuid.uuid4())+".jpg"),roi)
                        continue
                    roi=cv2.resize(roi,(300,300),interpolation=cv2.INTER_LINEAR)
                    cv2.imwrite(os.path.join("artifacts/faces",str(uuid.uuid4())+".jpg"),roi)
                    self.face_queue.put([roi,camera_id,timestamp])
            
        except Exception as e:
            raise CustomException(e,sys)