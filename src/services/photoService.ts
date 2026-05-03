import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

let cameraPlugin: any = null;

async function getCamera() {
  if (cameraPlugin) return cameraPlugin;
  try {
    const mod = await import('@capacitor/camera');
    cameraPlugin = mod.Camera;
    return { Camera: cameraPlugin, CameraResultType: mod.CameraResultType, CameraSource: mod.CameraSource };
  } catch {
    return null;
  }
}

export async function takePhoto(): Promise<string | null> {
  const cam = await getCamera();
  if (!cam) return null;

  try {
    const photo = await cam.Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: cam.CameraResultType.DataUrl,
      source: cam.CameraSource.Prompt,
      width: 800,
      height: 800,
    });

    return photo.dataUrl || null;
  } catch {
    return null;
  }
}

export async function uploadPhoto(
  dataUrl: string,
  path: string,
): Promise<string> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}

export async function captureAndUpload(
  folder: string,
  fileName: string,
): Promise<{ dataUrl: string; downloadUrl: string } | null> {
  const dataUrl = await takePhoto();
  if (!dataUrl) return null;

  try {
    const path = `${folder}/${fileName}_${Date.now()}.jpg`;
    const downloadUrl = await uploadPhoto(dataUrl, path);
    return { dataUrl, downloadUrl };
  } catch (e) {
    console.warn('Photo upload failed, using local data URL:', e);
    return { dataUrl, downloadUrl: dataUrl };
  }
}
