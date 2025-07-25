import { getConversation, updateUserAnnotation } from '@DAL/server-requests/conversations';
import FinishConversationDialog from '@components/common/FinishConversationDialog';
import LoadingPage from '@components/common/LoadingPage';
import { SnackbarStatus, useSnackbar } from '@contexts/SnackbarProvider';
import { useConversationId } from '@hooks/useConversationId';
import useEffectAsync from '@hooks/useEffectAsync';
import { Dialog, Grid, useMediaQuery, Box, Typography } from '@mui/material';
import theme from '@root/Theme';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExperimentCoversationForms, getExperimentFeatures } from '../../DAL/server-requests/experiments';
import { ConversationForm } from '../../components/forms/conversation-form/ConversationForm';
import { useExperimentId } from '../../hooks/useExperimentId';
import { UserAnnotation } from '../../models/AppModels';
import PyLipsFaceViewer from '../../components/pylips/PyLipsFaceViewer';
import { MainContainer, MessageListContainer, SectionContainer, SectionInnerContainer } from './ChatPage.s';
import MessageList from './components/MessageList';
import InputBox from './components/input-box/InputBox';
import { SidebarChat } from './components/side-bar-chat/SideBarChat';

interface ChatPageProps {
    isFinishDialogOpen: boolean;
    setIsFinishDialogOpen: (open: boolean) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ isFinishDialogOpen, setIsFinishDialogOpen }) => {
    const navigate = useNavigate();
    const messagesRef = useRef(null);
    const { openSnackbar } = useSnackbar();
    const [messages, setMessages] = useState([]);
    const [conversationForms, setConversationForms] = useState({
        preConversation: null,
        postConversation: null,
    });
    const [messageFontSize, setMessageFontSize] = useState<'sm' | 'lg'>('lg');
    const [surveyOpen, setIsSurveyOpen] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [experimentFeatures, setExperimentFeatures] = useState(null);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [showPyLipsFace, setShowPyLipsFace] = useState(true);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const questionnaireLink = 'https://docs.google.com/forms/u/0/?tgif=d&ec=asw-forms-hero-goto';
    const conversationId = useConversationId();
    const experimentId = useExperimentId();

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages]);

    useEffectAsync(async () => {
        const preConversationFormAnsweredKey = `preConversationFormAnswered-${conversationId}`;
        const preConversationFormAnsweredKeyAnswered = sessionStorage.getItem(preConversationFormAnsweredKey);
        try {
            const [conversation, conversationForms, experimentFeaturesRes] = await Promise.all([
                getConversation(conversationId),
                getExperimentCoversationForms(experimentId),
                getExperimentFeatures(experimentId),
            ]);
            if (!preConversationFormAnsweredKeyAnswered && conversationForms.preConversation) {
                setIsSurveyOpen(true);
            }
            setConversationForms(conversationForms);
            setExperimentFeatures(experimentFeaturesRes);
            setMessages(conversation.length ? conversation : []);
            setIsPageLoading(false);
        } catch (err) {
            openSnackbar('Failed to load conversation', SnackbarStatus.ERROR);
            navigate(-1);
        }
    }, []);

    const handlePreConversationSurveyDone = () => {
        const preConversationFormAnsweredKey = `preConversationFormAnswered-${conversationId}`;
        sessionStorage.setItem(preConversationFormAnsweredKey, 'true');
        setIsSurveyOpen(false);
    };

    const handleUpdateUserAnnotation = async (messageId: string, userAnnotation: UserAnnotation) => {
        try {
            await updateUserAnnotation(messageId, userAnnotation);
            setMessages(
                messages.map((message) => (message._id === messageId ? { ...message, userAnnotation } : message)),
            );
        } catch (error) {
            console.log(error);
        }
    };

    return isPageLoading ? (
        <LoadingPage />
    ) : (
        <MainContainer container>
            {!isMobile && (
                <Grid item xs={2} sm={2} md={2} lg={2} style={{ backgroundColor: '#f5f5f5' }}>
                    <SidebarChat
                        setIsOpen={setIsFinishDialogOpen}
                        setMessageFontSize={setMessageFontSize}
                        messageFontSize={messageFontSize}
                    />
                </Grid>
            )}
            <Grid item xs={12} sm={10} md={10} lg={10}>
                <SectionContainer>
                    <SectionInnerContainer container direction="column">
                        {/* PyLips数字人脸显示区域 */}
                        <Grid item sx={{ width: '100%', maxWidth: '400px', alignSelf: 'center', mb: 2 }}>
                            <PyLipsFaceViewer
                                isVisible={showPyLipsFace}
                                onToggleVisibility={() => setShowPyLipsFace(!showPyLipsFace)}
                                conversationId={conversationId}
                            />
                        </Grid>
                        <MessageListContainer ref={messagesRef} item>
                            <MessageList
                                isMobile={isMobile}
                                messages={messages}
                                isMessageLoading={isMessageLoading}
                                size={messageFontSize}
                                handleUpdateUserAnnotation={handleUpdateUserAnnotation}
                                experimentHasUserAnnotation={experimentFeatures?.userAnnotation}
                                experimentFeatures={experimentFeatures}
                            />
                        </MessageListContainer>
                        <Grid item display={'flex'} justifyContent={'center'} flexDirection="column" alignItems="center">
                            {/* SadTalker视频功能信息提示 */}
                            {experimentFeatures?.sadTalker?.enabled && (
                                <Box sx={{ 
                                    marginBottom: '8px', 
                                    padding: '8px', 
                                    backgroundColor: '#f0f9ff', 
                                    borderRadius: '8px',
                                    border: '1px solid #bfdbfe'
                                }}>
                                    <Typography variant="caption" color="primary.main" textAlign="center">
                                        🎭 AI视频回复功能已启用 - AI回复时将自动生成说话视频
                                    </Typography>
                                </Box>
                            )}
                            <InputBox
                                isMobile={isMobile}
                                messages={messages}
                                setMessages={setMessages}
                                conversationId={conversationId}
                                setIsMessageLoading={setIsMessageLoading}
                                fontSize={messageFontSize}
                                isStreamMessage={experimentFeatures?.streamMessage}
                                experimentFeatures={experimentFeatures}
                            />
                        </Grid>
                    </SectionInnerContainer>
                </SectionContainer>
            </Grid>
            {isFinishDialogOpen && (
                <FinishConversationDialog
                    open={isFinishDialogOpen}
                    setIsOpen={setIsFinishDialogOpen}
                    questionnaireLink={questionnaireLink}
                    form={conversationForms.postConversation}
                />
            )}
            <Dialog
                open={surveyOpen}
                maxWidth={'lg'}
                fullScreen={isMobile}
                PaperProps={{
                    style: {
                        maxHeight: isMobile ? 'none' : '70vh',
                        overflow: 'auto',
                    },
                }}
            >
                <ConversationForm
                    form={conversationForms.preConversation}
                    isPreConversation={true}
                    handleDone={handlePreConversationSurveyDone}
                />
            </Dialog>
        </MainContainer>
    );
};

export default ChatPage;
