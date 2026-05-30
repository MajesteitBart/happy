/**
 * Horizontal scrollable strip showing selected attachment previews.
 * Images render as thumbnails; documents render as compact file chips.
 */
import * as React from 'react';
import { ScrollView, View, Pressable, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import type { AttachmentPreview } from '@/sync/attachmentTypes';
import { thumbhashToDataUri } from '@/utils/thumbhash';

const THUMB_SIZE = 64;
const BORDER_RADIUS = 8;

interface AgentInputAttachmentStripProps {
    attachments: AttachmentPreview[];
    onRemove: (id: string) => void;
}

export function AgentInputAttachmentStrip({ attachments, onRemove }: AgentInputAttachmentStripProps) {
    const { theme } = useUnistyles();

    if (attachments.length === 0) return null;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.strip}
            contentContainerStyle={styles.stripContent}
            keyboardShouldPersistTaps="always"
        >
            {attachments.map((attachment) => (
                <AttachmentPreviewItem
                    key={attachment.id}
                    attachment={attachment}
                    onRemove={onRemove}
                    theme={theme}
                />
            ))}
        </ScrollView>
    );
}

function AttachmentPreviewItem({
    attachment,
    onRemove,
    theme,
}: {
    attachment: AttachmentPreview;
    onRemove: (id: string) => void;
    theme: any;
}) {
    const isImage = attachment.mimeType.startsWith('image/') && attachment.width > 0 && attachment.height > 0;

    const placeholder = React.useMemo(() => {
        if (!attachment.thumbhash) return undefined;
        const uri = thumbhashToDataUri(attachment.thumbhash);
        return uri ? { uri } : undefined;
    }, [attachment.thumbhash]);

    return (
        <View style={[
            isImage ? styles.thumbContainer : styles.fileContainer,
            { borderColor: theme.colors.divider }
        ]}>
            {isImage ? (
                <Image
                    source={{ uri: attachment.uri }}
                    placeholder={placeholder}
                    style={[{ width: THUMB_SIZE, height: THUMB_SIZE }, styles.thumb]}
                    contentFit="cover"
                    transition={150}
                />
            ) : (
                <View style={styles.fileContent}>
                    <Ionicons name="document-text-outline" size={22} color={theme.colors.textSecondary} />
                    <View style={styles.fileTextContainer}>
                        <Text style={[styles.fileName, { color: theme.colors.text }]} numberOfLines={1}>
                            {attachment.name}
                        </Text>
                        <Text style={[styles.fileMeta, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                            {formatFileMeta(attachment)}
                        </Text>
                    </View>
                </View>
            )}
            {/* Remove button */}
            <Pressable
                onPress={() => onRemove(attachment.id)}
                hitSlop={4}
                style={(p) => [
                    styles.removeButton,
                    { backgroundColor: theme.colors.surfaceHigh, opacity: p.pressed ? 0.7 : 1 }
                ]}
            >
                <Ionicons name="close" size={10} color={theme.colors.text} />
            </Pressable>
        </View>
    );
}

function formatFileMeta(attachment: AttachmentPreview) {
    const size = attachment.size > 0 ? formatBytes(attachment.size) : '';
    const type = attachment.mimeType && attachment.mimeType !== 'application/octet-stream'
        ? attachment.mimeType
        : 'file';
    return size ? `${type} - ${size}` : type;
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(kb >= 10 ? 0 : 1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

const styles = StyleSheet.create(() => ({
    strip: {
        marginBottom: 8,
        marginHorizontal: 8,
    },
    stripContent: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 4,
    },
    thumbContainer: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: BORDER_RADIUS,
        overflow: 'visible',
        borderWidth: 1,
        position: 'relative',
    },
    thumb: {
        borderRadius: BORDER_RADIUS,
    },
    fileContainer: {
        width: 190,
        height: THUMB_SIZE,
        borderRadius: BORDER_RADIUS,
        borderWidth: 1,
        position: 'relative',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    fileContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minWidth: 0,
    },
    fileTextContainer: {
        flex: 1,
        minWidth: 0,
    },
    fileName: {
        fontSize: 13,
        fontWeight: '600',
    },
    fileMeta: {
        fontSize: 11,
        marginTop: 2,
    },
    removeButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
}));
