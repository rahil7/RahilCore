export interface FileAccess {
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
}

export interface CachedFileAccess {
    url: string;
    expiresAt: number;
}