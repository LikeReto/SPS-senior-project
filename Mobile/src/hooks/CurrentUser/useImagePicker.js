import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';
import { useAuth } from "@/src/Contexts/AuthContext";

const MAX_IMAGE_SIZE = 250 * 1024; // 250 KB
const MAX_VIDEO_SIZE = 30 * 1024 * 1024; // 30 MB

const useImagePicker = () => {
  const { App_Language } = useAuth();

  const compressImageIfNeeded = async (uri) => {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.size > MAX_IMAGE_SIZE) {
      const compressed = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      const compressedInfo = await FileSystem.getInfoAsync(compressed.uri);
      return { uri: compressed.uri, size: compressedInfo.size };
    }
    return { uri, size: info.size };
  };

  const validateFile = async (asset) => {
    const info = await FileSystem.getInfoAsync(asset.uri);

    if (asset.type === 'image') {
      const { uri, size } = await compressImageIfNeeded(asset.uri);
      return {
        uri,
        fileSize: size,
        mimeType: asset.mimeType || 'image/jpeg',
        name: uri.split('/').pop(),
      };
    } else if (asset.type === 'video') {
      if (info.size > MAX_VIDEO_SIZE) {
        throw new Error(
          App_Language?.startsWith("ar")
            ? 'يجب أن يكون الفيديو أقل من 30 ميغابايت'
            : 'Video must be under 30 MB'
        );
      }
      return {
        uri: asset.uri,
        fileSize: info.size,
        mimeType: asset.mimeType || 'video/mp4',
        name: asset.uri.split('/').pop(),
      };
    }

    throw new Error(
      App_Language?.startsWith("ar")
        ? 'نوع الملف غير مدعوم'
        : 'Unsupported file type'
    );
  };

  const pickImage = useCallback(async ({ multiple = false, maxFiles = 10, allowVideo = false }) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          App_Language?.startsWith('ar') ? '❌ خطأ' : 'Error ❌',
          App_Language?.startsWith("ar")
            ? 'الرجاء السماح بالوصول للصور'
            : 'Permission Denied to access Photos'
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: allowVideo ? ['images', 'videos'] : ['images'],
        allowsMultipleSelection: multiple,
        quality: 0.6,
        selectionLimit: maxFiles,
      });

      if (result.canceled) return null;

      const assets = result.assets || [];

      const validated = await Promise.all(
        assets.map(async (asset) => {
          try {
            return await validateFile(asset);
          } catch (err) {
            Alert.alert(
              App_Language?.startsWith("ar") ? '❌ خطأ في الملف' : 'File Error ❌',
              err.message
            );
            return null;
          }
        })
      );

      const filtered = validated.filter(Boolean);

      return multiple ? filtered : filtered[0];
    } catch (error) {
      console.log("❌ ImagePicker Error:", error);
      Alert.alert(
        App_Language?.startsWith('ar') ? '❌ حدث خطأ ما !' : 'Something went wrong ❌',
        App_Language?.startsWith("ar") ? 'يرجى المحاولة مرة أخرى' : 'Please try again'
      );
      return null;
    }
  }, [App_Language, validateFile]);

  return { pickImage };
};

export default useImagePicker;
