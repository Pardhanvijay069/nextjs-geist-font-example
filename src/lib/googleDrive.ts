import { google } from 'googleapis';
import { Readable } from 'stream';

// Google Drive configuration
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

// Initialize Google Drive API
const auth = new google.auth.JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth });

export interface UploadResult {
  fileId: string;
  fileName: string;
  publicUrl: string;
}

/**
 * Upload file to Google Drive
 */
export const uploadToGoogleDrive = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<UploadResult> => {
  try {
    // Create a readable stream from buffer
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    // Upload file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType,
        body: stream,
      },
    });

    const fileId = response.data.id!;

    // Make file publicly accessible
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Generate public URL
    const publicUrl = `https://drive.google.com/uc?id=${fileId}`;

    return {
      fileId,
      fileName,
      publicUrl,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw new Error('Failed to upload file to Google Drive');
  }
};

/**
 * Upload multiple files to Google Drive
 */
export const uploadMultipleFiles = async (
  files: Array<{ buffer: Buffer; fileName: string; mimeType: string }>
): Promise<UploadResult[]> => {
  try {
    const uploadPromises = files.map(file =>
      uploadToGoogleDrive(file.buffer, file.fileName, file.mimeType)
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw new Error('Failed to upload files to Google Drive');
  }
};

/**
 * Delete file from Google Drive
 */
export const deleteFromGoogleDrive = async (fileId: string): Promise<void> => {
  try {
    await drive.files.delete({
      fileId,
    });
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    throw new Error('Failed to delete file from Google Drive');
  }
};

/**
 * Get file info from Google Drive
 */
export const getFileInfo = async (fileId: string) => {
  try {
    const response = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, createdTime',
    });

    return response.data;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw new Error('Failed to get file information');
  }
};

/**
 * Create folder in Google Drive
 */
export const createFolder = async (folderName: string, parentFolderId?: string): Promise<string> => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : [GOOGLE_DRIVE_FOLDER_ID],
      },
    });

    return response.data.id!;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error('Failed to create folder');
  }
};

/**
 * List files in Google Drive folder
 */
export const listFiles = async (folderId?: string) => {
  try {
    const response = await drive.files.list({
      q: `'${folderId || GOOGLE_DRIVE_FOLDER_ID}' in parents`,
      fields: 'files(id, name, mimeType, size, createdTime)',
    });

    return response.data.files || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error('Failed to list files');
  }
};
