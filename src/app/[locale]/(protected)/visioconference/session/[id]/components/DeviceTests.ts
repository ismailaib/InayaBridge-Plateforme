export const testMicrophone = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone test successful");
    stream.getTracks().forEach((track) => track.stop());
  } catch (error) {
    console.error("Microphone test failed:", error);
  }
};

export const testCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log("Camera test successful");
    stream.getTracks().forEach((track) => track.stop());
  } catch (error) {
    console.error("Camera test failed:", error);
  }
};

export const testSpeakers = () => {
  const audio = new Audio(
    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyDy/LFdCkFKH3J8NyOPwoUXbPq66hWFApGnt/yvmw",
  );
  audio.play().catch((e) => console.log("Speaker test failed:", e));
};