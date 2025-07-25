import LoadingPage from '@components/common/LoadingPage';
import LoginExperimentRoute from '@components/common/LoginExperimentRoute';
import PrivateExperimentRoute from '@components/common/ProtectedExperimentRoute';
import ServiceStatusMonitor from '@components/common/ServiceStatusMonitor';
import GlobalErrorHandler from '@components/common/GlobalErrorHandler';
import useActiveUser from '@hooks/useActiveUser';
import ProjectOverview from '@screens/Project-Overview/ProjectOverview';
import React, { FC, Suspense, lazy, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles.css';

export const Pages = {
    PROJECT_OVERVIEW: '/project-overview',
    SYSTEM_MANAGEMENT: '/system',
    ADMIN: '/admin',
    ADMIN_LOGIN: '/admin/login',
    EXPERIMENT: '/e/:experimentId',
    EXPERIMENT_CONVERSATION: '/e/:experimentId/c/:conversationId',
    EXPERIMENT_LOGIN: '/e/:experimentId/login',
    GENERAL_LOGIN: 'login',
} as const;

const App: FC = () => {
    const { activeUser, isLoading } = useActiveUser();
    const [openEndConversationDialog, setOpenEndConversationDialog] = useState(false);
    const Home = lazy(() => import('@screens/Home/Home'));
    const Admin = lazy(() => import('@screens/Admin/Admin'));
    const ChatPage = lazy(() => import('@screens/Chat/ChatPage'));
    const Login = lazy(() => import('@screens/Login/Login'));
    const SystemManagement = lazy(() => import('@screens/System/SystemManagement'));
    const TopBar = lazy(() => import('@components/top-bar/TopBar'));

    return (
        <BrowserRouter>
            <GlobalErrorHandler>
                <ServiceStatusMonitor />
                <Suspense fallback={<LoadingPage />}>
                    {isLoading ? (
                        <LoadingPage />
                    ) : (
                        <Routes>
                        <Route
                            path={Pages.PROJECT_OVERVIEW}
                            element={
                                <>
                                    <TopBar setIsOpen={setOpenEndConversationDialog} />
                                    <ProjectOverview />
                                </>
                            }
                        />
                        
                        {/* System Management Route */}
                        <Route
                            path={Pages.SYSTEM_MANAGEMENT}
                            element={
                                activeUser?.isAdmin ? (
                                    <>
                                        <TopBar setIsOpen={setOpenEndConversationDialog} />
                                        <SystemManagement />
                                    </>
                                ) : (
                                    <Navigate to={Pages.ADMIN_LOGIN} />
                                )
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path={`${Pages.ADMIN}/*`}
                            element={activeUser?.isAdmin ? <Admin /> : <Navigate to={Pages.ADMIN_LOGIN} />}
                        />
                        <Route
                            path={Pages.ADMIN_LOGIN}
                            element={
                                activeUser && activeUser?.isAdmin ? (
                                    <Navigate to={Pages.ADMIN} replace />
                                ) : (
                                    <>
                                        <TopBar setIsOpen={setOpenEndConversationDialog} />
                                        <Login />
                                    </>
                                )
                            }
                        />

                        {/* Experiment Routes */}
                        <Route
                            path={Pages.EXPERIMENT}
                            element={
                                <PrivateExperimentRoute TopBar={TopBar} setIsOpen={setOpenEndConversationDialog} />
                            }
                        >
                            <Route path="" element={<Home />} />
                            <Route
                                path={Pages.EXPERIMENT_CONVERSATION.replace(`${Pages.EXPERIMENT}/`, '')}
                                element={
                                    <ChatPage
                                        isFinishDialogOpen={openEndConversationDialog}
                                        setIsFinishDialogOpen={setOpenEndConversationDialog}
                                    />
                                }
                            />
                        </Route>
                        <Route
                            path={Pages.EXPERIMENT_LOGIN}
                            element={
                                <LoginExperimentRoute TopBar={TopBar} setIsOpen={setOpenEndConversationDialog} />
                            }
                        >
                            <Route path="" element={<Login />} />
                        </Route>

                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to={activeUser?.isAdmin ? Pages.ADMIN : Pages.PROJECT_OVERVIEW}
                                    replace
                                />
                            }
                        />
                        </Routes>
                    )}
                </Suspense>
            </GlobalErrorHandler>
        </BrowserRouter>
    );
};

export default React.memo(App);
