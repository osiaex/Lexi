import LoadingDots from '@components/loadig-dots/LoadingDots';
import { Box } from '@mui/material';
import { MessageType, ExperimentFeatures } from '@root/models/AppModels';
import Message from './Message';

interface MessageListProps {
    isMobile: boolean;
    messages: MessageType[];
    isMessageLoading: boolean;
    size: 'sm' | 'lg';
    handleUpdateUserAnnotation: (messageId, userAnnotation) => void;
    experimentHasUserAnnotation: boolean;
    experimentFeatures?: ExperimentFeatures;
}

const MessageList: React.FC<MessageListProps> = ({
    isMobile,
    messages,
    isMessageLoading,
    size,
    experimentHasUserAnnotation,
    handleUpdateUserAnnotation,
    experimentFeatures,
}) => (
    <Box height="100%" width={isMobile ? '100%' : '85%'} padding={2}>
        {messages.map((message, index) => (
            <Message
                key={index}
                message={message}
                role={message.role}
                size={size}
                handleUpdateUserAnnotation={handleUpdateUserAnnotation}
                experimentHasUserAnnotation={experimentHasUserAnnotation}
                experimentFeatures={experimentFeatures}
            />
        ))}
        {isMessageLoading && <LoadingDots />}
    </Box>
);

export default MessageList;
