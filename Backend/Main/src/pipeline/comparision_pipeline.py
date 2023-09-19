import os
import cv2
import sys
import uuid
import torch
import numpy as np
import face_recognition
import torch.nn.functional as F
from torchvision import transforms
from src.exception import CustomException
from facenet_pytorch import InceptionResnetV1

class Comparision_dlib:
    def __init__(self,face_queue):
        self.face_queue=face_queue

    def load_and_encode_image(self,image):
        try:
            face_locations = face_recognition.face_locations(image)
            face_encodings = face_recognition.face_encodings(image, face_locations)
            return image, face_locations, face_encodings
        except Exception as e:
            raise CustomException(e,sys)

    def compare_faces(self,encoding1, encoding2):
        try:
            distance = face_recognition.face_distance(encoding1, encoding2)
            similarity_threshold=0.6
            if distance < similarity_threshold:
                return True,distance
            else:
                return False,distance
        except Exception as e:
            raise CustomException(e,sys)
        
    def compare_face_encodings(self, face_encodings1, face_encodings2, existing_uuids):
        try:
            max_similarity = 1
            matched_id = "-"
            for encoding1, uuids in zip(face_encodings1, existing_uuids):
                for encoding2 in face_encodings2:
                    is_matched, distance = self.compare_faces(encoding1, encoding2)
                    print("is_matched",is_matched,"distance:",distance)
                    if is_matched:
                        if distance < max_similarity:
                            max_similarity = distance
                            matched_id = uuids
            if matched_id == "-":
                return False, None
            return True, matched_id
        except Exception as e:
            raise CustomException(e, sys)
   
    def compare_image_with_dataframe(self,collection):
        try:
            while True:
                exit_status=False
                image_path,camera_id,timestamp=self.face_queue.get()
                print("got face",timestamp)

                if image_path is None:
                    return
                image, _, face_encodings = self.load_and_encode_image(image_path)
                if(len(face_encodings)==0):

                    cv2.imwrite(os.path.join("artifacts/ng",str(uuid.uuid4())+".jpg"),image)
                    print("Face encodings are not generated")
                    continue
                
                all_faces=collection.find()
                existing_encoding=[doc["FACE_ENCODINGS"] for doc in all_faces]
                all_faces=collection.find()
                existing_uuids=[doc["_id"] for doc in all_faces]

                existing_face_encodings=[np.fromstring(encoding, dtype=np.float64, sep=',') for encoding in existing_encoding]
                existing_face_encodings = [np.reshape(encodings, (-1, 128)) for encodings in existing_face_encodings]
                similarity_found, matched_id= self.compare_face_encodings(existing_face_encodings, face_encodings, existing_uuids)

                if similarity_found:
                    instance=collection.find_one({"_id":matched_id})
                    if instance.get("CAMERA_ID")[-1] != camera_id:
                        if camera_id == "1": exit_status=True
                        current_camera=camera_id
                        collection.update_one(
                                            {"_id": matched_id},
                                            {
                                                '$push': 
                                                {
                                                    "CAMERA_ID": camera_id,
                                                    "TIMESTAMP": timestamp
                                                },
                                                '$set': 
                                                {
                                                    "EXIT_STATUS": exit_status,
                                                    "CURRENT_CAMERA" : current_camera
                                                }
                                            }
                                            )
                        print(f"Similar face found in the dataframe for image with out same cid")
                    else:
                        print("same camera_id") 
                    continue

                unique_id = str(uuid.uuid4())
                new_face_encoding = ','.join(str(x) for x in np.array(face_encodings).flatten().tolist())
                print(new_face_encoding)
                current_camera=camera_id
                new_face={
                    "UNIQUE_ID": unique_id,
                    "CAMERA_ID": [camera_id],
                    "TIMESTAMP": [timestamp],
                    "FACE_ENCODINGS": new_face_encoding,
                    "CURRENT_CAMERA" : current_camera,
                    "EXIT_STATUS" : exit_status
                    }
                collection.insert_one(new_face)
                cv2.imwrite(os.path.join("artifacts/outs",unique_id+".jpg"),image)
                print(f"Face added to the dataframe for image")
        
        except Exception as e:
            raise CustomException(e,sys)
        

class Comparision_pytorch:
    def __init__(self,face_queue):
        self.face_queue=face_queue

    def load_facenet_model(self):
        try:
            resnet = InceptionResnetV1(pretrained='vggface2').eval()
            return resnet
        except Exception as e:
            raise CustomException(e,sys)
    
    def is_similar(self,tensor1, tensor2, threshold=0.4):
        try:
            tensor1 = tensor1.view(1, -1)
            tensor2 = tensor2.view(1, -1)
            similarity = F.cosine_similarity(tensor1, tensor2)
            return similarity > threshold
        except Exception as e:
            raise CustomException(e,sys)
    
    def extract_face_features(self,image, resnet):
        try:
            image = image.unsqueeze(0)
            face_features = resnet(image)
            return face_features[0]
        except Exception as e:
            raise CustomException(e,sys)

    def compare_image_with_dataframe(self,collection):
        try:
            while True:
                print("got face")
                exit_status=False
                image,camera_id,timestamp=self.face_queue.get()

                if image is None:
                    return
    
                temp_image=image
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                transform = transforms.Compose([transforms.ToPILImage(),transforms.Resize((160, 160)),transforms.ToTensor()])                             
                image = transform(image)
                resnet = self.load_facenet_model()
                face_features = self.extract_face_features(image, resnet)

                if len(face_features)==0:
                    cv2.imwrite(os.path.join("artifacts/ng",str(uuid.uuid4())+".jpg"),temp_image)
                    print("face encodings not generated")
                    continue 
                
                is_unique = True
                all_faces=collection.find()
                existing_encoding=[doc["FACE_ENCODINGS"] for doc in all_faces]
                all_faces=collection.find()
                existing_uuids=[doc["_id"] for doc in all_faces]

                existing_encoding=[np.fromstring(encoding, dtype=np.float64, sep=',') for encoding in existing_encoding]

                for encoding, uuids in zip(existing_encoding, existing_uuids):
                    if self.is_similar(face_features, torch.tensor(encoding)):
                        is_unique = False
                        matched_id=uuids
                        break

                if is_unique:
                    current_camera=camera_id
                    unique_id = str(uuid.uuid4())
                    if camera_id == "1": exit_status=True
                    new_face={
                        "UNIQUE_ID": unique_id,
                        "CAMERA_ID": [camera_id],
                        "TIMESTAMP": [timestamp],
                        "FACE_ENCODINGS": ','.join(str(x) for x in np.array(face_features.detach().numpy()).flatten().tolist()),
                        "CURRENT_CAMERA" : current_camera,
                        "EXIT_STATUS" : exit_status
                        }
                    collection.insert_one(new_face)
                    cv2.imwrite(os.path.join("artifacts/outs",unique_id+".jpg"),temp_image)
                    print(f"Face added to the dataframe for image")
                else:
                    instance=collection.find_one({"_id":matched_id})
                    if instance.get("CAMERA_ID")[-1] != camera_id:
                        if camera_id == "1": exit_status=True
                        current_camera=camera_id
                        collection.update_one(
                                            {"_id": matched_id},
                                            {
                                                '$push': 
                                                {
                                                    "CAMERA_ID": camera_id,
                                                    "TIMESTAMP": timestamp
                                                },
                                                '$set': 
                                                {
                                                    "EXIT_STATUS": exit_status,
                                                    "CURRENT_CAMERA" : current_camera
                                                }
                                            }
                                            )
                        print(f"Similar face found in the dataframe for image with out same cid")
                    else:
                        print("same camera_id") 
        
        except Exception as e:
            raise CustomException(e,sys)



