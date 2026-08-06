import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Cache the whole module shape, not just Camera — caching `mod.Camera` alone
// and returning it directly on subsequent calls meant every call after the
// first handed back an object with no `.Camera`, so `cam.Camera.getPhoto`
// threw and the photo silently never appeared.
let cameraModule: { Camera: any; CameraResultType: any; CameraSource: any } | null = null;

async function getCamera() {
  if (cameraModule) return cameraModule;
  try {
    const mod = await import('@capacitor/camera');
    cameraModule = {
      Camera: mod.Camera,
      CameraResultType: mod.CameraResultType,
      CameraSource: mod.CameraSource,
    };
    return cameraModule;
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
  } catch (e) {
    // A user cancelling the picker lands here too, so this stays quiet — but
    // log it so a genuine plugin/permission failure isn't invisible.
    console.warn('[photo] getPhoto failed or was cancelled:', e);
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

/**
 * Uploads to Storage, falling back to the inline data URL when that fails
 * (Storage not reachable, rules denying the write...) so a picked photo is
 * never lost just because the upload didn't go through.
 *
 * Callers should show the local data URL from `takePhoto` straight away and
 * call this in the background — awaiting the upload before showing anything
 * is what made the picker look like it did nothing.
 */
export async function uploadPhotoOrFallback(
  dataUrl: string,
  folder: string,
  fileName: string,
): Promise<string> {
  try {
    const path = `${folder}/${fileName}_${Date.now()}.jpg`;
    return await uploadPhoto(dataUrl, path);
  } catch (e) {
    console.warn('[photo] upload failed, keeping local data URL:', e);
    return dataUrl;
  }
}
