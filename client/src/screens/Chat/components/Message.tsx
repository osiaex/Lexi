import { Box, Typography } from '@mui/material';
import theme from '@root/Theme';
import { MessageType, ExperimentFeatures } from '@root/models/AppModels';
import UserAnnotation from './UserAnnotation';
import TalkingVideoPlayer from './TalkingVideoPlayer';

interface MessageProps {
    message: MessageType;
    role: string;
    size?: 'sm' | 'lg';
    experimentHasUserAnnotation: boolean;
    handleUpdateUserAnnotation: (messageId, userAnnotation) => void;
    experimentFeatures?: ExperimentFeatures;
}

const Message: React.FC<MessageProps> = ({
    experimentHasUserAnnotation,
    size = 'lg',
    message,
    role,
    handleUpdateUserAnnotation,
    experimentFeatures,
}) => {
    const isUser = role === 'user';
    const hasTalkingVideo = message.talkingVideo && experimentFeatures?.sadTalker?.enabled && !isUser;
    
    // 调试信息
    if (!isUser && experimentFeatures?.sadTalker?.enabled) {
        console.log('Message component - SadTalker enabled:', {
            hasVideo: !!message.talkingVideo,
            videoLength: message.talkingVideo?.length || 0,
            messageId: message._id
        });
    }

    const getFormattedMessage = (content) => {
        const parts = content
            .split(/(\*\*.*?\*\*)/g)
            .map((part) =>
                part.startsWith('**') && part.endsWith('**') ? <b key={part}>{part.slice(2, -2)}</b> : part,
            );
        return parts;
    };

    return (
        <Box
            sx={{
                marginBottom: 1.5,
                maxWidth: '80%',
                display: 'inline-block',
                float: isUser ? 'right' : 'left',
                clear: 'both',
            }}
        >
            <Box display={'flex'} flexDirection={'column'}>
                {/* 如果是AI消息且有说话视频，显示视频 */}
                {hasTalkingVideo && (
                    <Box sx={{ 
                        marginBottom: 1, 
                        float: 'left',
                        display: 'flex',
                        justifyContent: 'flex-start'
                    }}>
                        <TalkingVideoPlayer
                            videoBase64={message.talkingVideo}
                            autoPlay={experimentFeatures.sadTalker.autoPlay}
                        />
                    </Box>
                )}
                
                <Box
                    sx={{
                        marginBottom: 1,
                        padding: '16px 16px 24px 16px',
                        borderRadius: isUser ? '26px 26px 0 26px' : '26px 26px 26px 0',
                        background: isUser ? theme.palette.userMessage.main : theme.palette.assistantMessage.main,
                        display: 'inline-block',
                        clear: 'both',
                        float: isUser ? 'right' : 'left',
                        fontFamily: 'Lato',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            whiteSpace: 'pre-line',
                            fontSize: size === 'sm' ? '1rem' : '1.25rem',
                            fontWeight: 500,
                        }}
                    >
                        {getFormattedMessage(message.content)}
                    </Typography>
                </Box>
                {!isUser && experimentHasUserAnnotation && message._id && (
                    <UserAnnotation
                        key={message._id}
                        message={message}
                        handleUpdateUserAnnotation={handleUpdateUserAnnotation}
                    />
                )}
            </Box>
        </Box>
    );
};

export default Message;
