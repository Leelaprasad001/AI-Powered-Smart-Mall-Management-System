from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime
from pytz import timezone
from collections import Counter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# origins = ["http://localhost:3000"]  # Replace with your React app's URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



data = []
class User(BaseModel):
  EMAIL: str
  PASSWORD : str

class DataItem(BaseModel):
    _id: str
    UNIQUE_ID: str
    CAMERA_ID: list[str]
    TIMESTAMP: list[str]
    FACE_ENCODINGS: str
    CURRENT_CAMERA: str
    EXIT_STATUS: bool

mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["Smart_Mall_Management"]


@app.post("/create_user/")
async def create_user(email: str, password: str):
    collection = db["Users"]
    existing_user = collection.find_one({"EMAIL": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user_data = {"EMAIL": email, "PASSWORD": password}
    collection.insert_one(user_data)
    return {"message": "User created successfully"}


@app.get("/get_user/")
async def get_user(email: str, password: str):
    collection = db["Users"]
    user_data = collection.find_one({"EMAIL": email, "PASSWORD": password})
    if user_data is None:
        raise HTTPException(status_code=404, detail="Invalid username or password")
    
    user_data["_id"] = str(user_data["_id"])
    
    return user_data

@app.get("/current_count/")
async def current_count():
    collection = db["Mall_Data"]
    current_count = collection.count_documents({"EXIT_STATUS": False})
    return current_count


@app.get("/overall_count/")
async def overall_count():
    collection = db["Mall_Data"]
    overall_count = collection.count_documents({})
    return overall_count


@app.get("/count_cam/")
async def count_cam(cam_id: str):
    collection = db["Mall_Data"]
    cam_count = collection.count_documents({"CURRENT_CAMERA": cam_id})
    return cam_count    

@app.get("/peak_hour")
async def get_peak_hour():
    collection = db["Mall_Data"]
    documents = collection.find()
    hour_counter = Counter()
    unique_ids_processed = set()
    total_count = 0

    for document in documents:
        timestamps = document.get("TIMESTAMP", [])
        unique_id = document.get("UNIQUE_ID", "")

        for timestamp in timestamps:
            dt = datetime.strptime(timestamp, "%a %b %d %H:%M:%S %Y")
            hour = dt.strftime("%I %p")

            if (timestamp, unique_id) not in unique_ids_processed:
                hour_counter[hour] += 1
                unique_ids_processed.add((timestamp, unique_id))

        total_count += 1

    peak_hour = hour_counter.most_common(1)[0]
    peak_hour_period = f"{peak_hour[0]} - {str(int(peak_hour[0].split()[0]) + 1)} {peak_hour[0].split()[1]}"
    count_percentage = (peak_hour[1] / total_count) * 100

    return {"peak_hour": peak_hour_period, "count_per": count_percentage, "count": peak_hour[1]}


@app.get("/api/data")
async def get_all_data():
    collection = db["Mall_Data"]
    documents = collection.find()
    data = []
    for document in documents:
        # Convert the ObjectId to a string
        document["_id"] = str(document["_id"])
        data.append(document)
    return data