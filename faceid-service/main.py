from fastapi import FastAPI, File, UploadFile
from deepface import DeepFace
import shutil
import os

app = FastAPI()

@app.post("/verify")

async def verify_img(img1: UploadFile = File(...), img2: UploadFile = File(...)):

    # 1. Definimos las rutas temporales para las imágenes [cite: 130]

    path1 = f"temp_{img1.filename}"
    path2 = f"temp_{img2.filename}"


    try:
        # 2. Guardamos las imágenes físicamente para que DeepFace pueda leerlas [cite: 133, 135]
        with open(path1, "wb") as buffer:
            shutil.copyfileobj(img1.file, buffer)

        with open(path2, "wb") as buffer:
            shutil.copyfileobj(img2.file, buffer)


        # 3. Llamada a la IA con los parámetros solicitados [cite: 138, 142, 143, 144]

        result = DeepFace.verify(
            img1_path = path1,
            img2_path = path2,
            model_name = 'Facenet',
            detector_backend = 'opencv',
            enforce_detection = True
        )


        # 4. Retornamos el JSON con los resultados [cite: 145, 147, 148]

        return {
            "verified": bool(result["verified"]),
            "distance": float(result["distance"]),
            "model": result["model"]
        }

    except Exception as e:
        return {"error": str(e)}

    finally:

        # 5. Limpieza: borramos las fotos temporales para no llenar la Raspberry [cite: 150]

        if os.path.exists(path1): os.remove(path1)

        if os.path.exists(path2): os.remove(path2)
