import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, `images/${path}/${file.name}`)
  const snapshot = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)
  return downloadURL
}

export async function uploadPageImage(file: File, pageId: string): Promise<string> {
  return uploadImage(file, `pages/${pageId}`)
}

export async function uploadLayoutImage(file: File, pageId: string, layoutId: string): Promise<string> {
  return uploadImage(file, `pages/${pageId}/layouts/${layoutId}`)
}
