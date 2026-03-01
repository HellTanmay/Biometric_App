# Biometric Service

'''
    py -3 -m venv .venv      
'''

## activate the environment

'''
    .venv\Scripts\activate 
'''

## Install Dependencies

'''
    pip install fastapi uvicorn numpy python-multipart
'''

## Install face recognition

'''
    pip install face_recognition
'''
## Run the server
'''
    uvicorn main:app --reload     

If an error occurs then install cmake and dlib

'''
    pip install cmake
'''

to install dlib, download this folder
https://github.com/z-mahmud22/Dlib_Windows_Python3.x.git

and follow the instructions in the github

Now Install face_recognition again

If it still gives error Install setuptools

'''
    pip install setuptools==76.0.0

