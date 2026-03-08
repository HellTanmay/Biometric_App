# Biometric App

## Installation
```bash
    cd Biometric_App
    npm install
    npx expo start --port 8088
```


# Biometric Service

## Installation steps
```bash
   py -3 -m venv .venv      
```

## activate the environment

```bash
    .venv\Scripts\activate 
```

## Install Dependencies

```bash
    pip install fastapi uvicorn numpy python-multipart
```

## Install face recognition

```bash
    pip install face_recognition
```
## Run the server
```bash
    uvicorn main:app --reload --port 8099
```
If an error occurs while installing fac_recognition, then install cmake and dlib manually

```bash
    pip install cmake
```

to install dlib, download the zip folder:
https://github.com/z-mahmud22/Dlib_Windows_Python3.x.git

and follow the instructions in the github file

Now Install face_recognition again

If it still gives error Install setuptools

```bash
    pip install setuptools==76.0.0
```

