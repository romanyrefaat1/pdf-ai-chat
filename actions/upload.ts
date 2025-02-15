"use server";

export async function handleFileUpload(file: File) {
  try {
    // Your file upload logic here
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
