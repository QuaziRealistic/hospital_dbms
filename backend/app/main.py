from fastapi import FastAPI

app = FastAPI() # oblect of app

@app.get("/") # root server link
def read_root():
    return {"message" : "Hospital System is running."} # test if it runs in json
