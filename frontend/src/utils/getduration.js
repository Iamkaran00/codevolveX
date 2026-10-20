export const getVideoDuration = (file) =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(Math.round(video.duration));
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Could not read video"));
    };

    video.src = URL.createObjectURL(file);
  });

 
// const duration = await getVideoDuration(videoFile);
// formData.append("duration", duration);