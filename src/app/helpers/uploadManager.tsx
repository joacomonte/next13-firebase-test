import { UploadTask, getStorage, ref, uploadBytesResumable } from "firebase/storage";

export const UploadManager = (file: File, app: any) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, "images/" + file.name);
    const task: UploadTask = uploadBytesResumable(storageRef, file);
  
    return {
      task,
      startUpload(onProgress: any, onError: any, onComplete: any) {
        task.on(
          "state_changed",
          onProgress,
          onError,
          onComplete
        );
      },
      pauseUpload() {
        task.pause();
      },
      resumeUpload() {
        task.resume();
      },
      isPaused() {
        return task.snapshot.state === "paused";
      },
      cancelUpload(){
        task.cancel();
      }
    };
  };
  