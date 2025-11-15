export const fixUploaded_File = async (File) => {
    try {
        let params;
        const fileName = File.uri.split("/").pop();

        params = {
            name: fileName,
            size: File.fileSize,
            type: File.mimeType,
            uri: File.uri
        };

        return params;
    }
    catch (error) {
        console.log('❌ file: fixUploaded_File.js ~> could not fix the File ~> ', error);
        return null;
    }
};
