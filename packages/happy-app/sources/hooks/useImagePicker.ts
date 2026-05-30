/**
 * Attachment picker hook for attaching images and documents to messages.
 *
 * Wraps expo-image-picker and expo-document-picker with permission handling,
 * thumbhash generation for images, and shared attachment limits.
 * Enforces limits: max 20 attachments per message, 10MB per file.
 *
 * Note: fileSize from expo-image-picker is optional — some platforms do not
 * provide it (returns undefined → size=0). Such files pass the client-side
 * size check; the server enforces the limit on upload. Phase 5 should handle
 * 413 responses gracefully.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import { Modal } from '@/modal';
import { generateThumbhash } from '@/utils/thumbhash';
import { t } from '@/text';
import type { AttachmentPreview } from '@/sync/attachmentTypes';

export const MAX_ATTACHMENTS_PER_MESSAGE = 20;
export const MAX_IMAGES_PER_MESSAGE = MAX_ATTACHMENTS_PER_MESSAGE;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type { AttachmentPreview };

type UseAttachmentPickerResult = {
    selectedAttachments: AttachmentPreview[];
    pickImages: () => Promise<void>;
    pickDocuments: () => Promise<void>;
    removeAttachment: (id: string) => void;
    clearAttachments: () => void;
    addAttachments: (attachments: AttachmentPreview[]) => void;
};

export function useAttachmentPicker(): UseAttachmentPickerResult {
    const [selectedAttachments, setSelectedAttachments] = useState<AttachmentPreview[]>([]);
    // Ref tracks current count to avoid stale closures on rapid taps.
    const selectedCountRef = useRef(0);
    useEffect(() => {
        selectedCountRef.current = selectedAttachments.length;
    }, [selectedAttachments]);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (Platform.OS === 'web') return true;

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Modal.alert(
                t('imageUpload.permissionTitle'),
                t('imageUpload.permissionMessage'),
                [{ text: t('common.ok') }],
            );
            return false;
        }
        return true;
    }, []);

    const addAttachments = useCallback((attachments: AttachmentPreview[]) => {
        setSelectedAttachments(prev => {
            const remaining = MAX_ATTACHMENTS_PER_MESSAGE - prev.length;
            if (remaining <= 0) return prev;
            return [...prev, ...attachments.slice(0, remaining)];
        });
    }, []);

    const pickImages = useCallback(async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        const remaining = MAX_ATTACHMENTS_PER_MESSAGE - selectedCountRef.current;
        if (remaining <= 0) {
            Modal.alert(
                t('imageUpload.limitTitle'),
                t('imageUpload.limitMessage', { max: MAX_ATTACHMENTS_PER_MESSAGE }),
                [{ text: t('common.ok') }],
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // expo-image-picker ~55: MediaTypeOptions deprecated
            allowsMultipleSelection: true,
            selectionLimit: remaining,
            quality: 1, // no recompression — preserve original for Claude
            exif: false,
        });

        if (result.canceled || !result.assets.length) return;

        // On web, selectionLimit is not enforced by the browser — clamp here.
        const assets = result.assets.slice(0, remaining);
        const previews: AttachmentPreview[] = [];

        for (const asset of assets) {
            const size = asset.fileSize ?? 0;

            if (size > MAX_FILE_SIZE) {
                Modal.alert(
                    t('imageUpload.fileTooLargeTitle'),
                    t('imageUpload.fileTooLargeMessage', { name: asset.fileName ?? 'image', maxMb: 10 }),
                    [{ text: t('common.ok') }],
                );
                continue;
            }

            const width = asset.width ?? 0;
            const height = asset.height ?? 0;
            // Skip thumbhash if dimensions are unavailable (prevents divide-by-zero).
            const thumbhash = (width > 0 && height > 0)
                ? await generateThumbhash(asset.uri, width, height)
                : undefined;

            previews.push({
                id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
                uri: asset.uri,
                width,
                height,
                mimeType: asset.mimeType ?? 'image/jpeg',
                size,
                name: asset.fileName ?? `image_${Date.now()}.jpg`,
                thumbhash,
            });
        }

        if (previews.length > 0) {
            addAttachments(previews);
        }
    }, [addAttachments, requestPermission]);

    const pickDocuments = useCallback(async () => {
        const remaining = MAX_ATTACHMENTS_PER_MESSAGE - selectedCountRef.current;
        if (remaining <= 0) {
            Modal.alert(
                t('imageUpload.limitTitle'),
                t('imageUpload.limitMessage', { max: MAX_ATTACHMENTS_PER_MESSAGE }),
                [{ text: t('common.ok') }],
            );
            return;
        }

        const result = await DocumentPicker.getDocumentAsync({
            multiple: true,
            copyToCacheDirectory: true,
            type: '*/*',
        });

        if (result.canceled || !result.assets.length) return;

        const previews: AttachmentPreview[] = [];
        for (const asset of result.assets.slice(0, remaining)) {
            const size = asset.size ?? 0;
            if (size > MAX_FILE_SIZE) {
                Modal.alert(
                    t('imageUpload.fileTooLargeTitle'),
                    t('imageUpload.fileTooLargeMessage', { name: asset.name ?? 'file', maxMb: 10 }),
                    [{ text: t('common.ok') }],
                );
                continue;
            }

            previews.push({
                id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
                uri: asset.uri,
                width: 0,
                height: 0,
                mimeType: asset.mimeType ?? 'application/octet-stream',
                size,
                name: asset.name ?? `file_${Date.now()}`,
            });
        }

        if (previews.length > 0) {
            addAttachments(previews);
        }
    }, [addAttachments]);

    const removeAttachment = useCallback((id: string) => {
        setSelectedAttachments(prev => prev.filter(att => att.id !== id));
    }, []);

    const clearAttachments = useCallback(() => {
        setSelectedAttachments([]);
    }, []);

    return { selectedAttachments, pickImages, pickDocuments, removeAttachment, clearAttachments, addAttachments };
}

export function useImagePicker() {
    const picker = useAttachmentPicker();
    return {
        selectedImages: picker.selectedAttachments,
        pickImages: picker.pickImages,
        removeImage: picker.removeAttachment,
        clearImages: picker.clearAttachments,
        addImages: picker.addAttachments,
    };
}
