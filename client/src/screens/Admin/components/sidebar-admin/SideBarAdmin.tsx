import { AdminSections } from '@DAL/constants';
import { setActiveUser } from '@DAL/redux/reducers/activeUserReducer';
import { logout } from '@DAL/server-requests/users';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FaceIcon from '@mui/icons-material/Face';
import MicIcon from '@mui/icons-material/Mic';
import { Divider, List, ListItem, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { MainContainer, StyledListItemIcon } from './SideBar.s';
import { StyledListItem } from './SideBarAdmin.s';

const sectionsConfig = [
    { id: AdminSections.EXPERIMENTS, label: 'Experiments', Icon: BookOutlinedIcon },
    { id: AdminSections.AGENTS, label: 'Agents', Icon: AutoAwesomeOutlinedIcon },
    { id: AdminSections.FORMS, label: 'Forms', Icon: TextSnippetIcon },
    { id: AdminSections.DATA, label: 'Data', Icon: InsertChartOutlinedOutlinedIcon },
    { id: AdminSections.PYLIPS, label: 'PyLips', Icon: FaceIcon },
    { id: AdminSections.WHISPER, label: 'Whisper', Icon: MicIcon },
    { id: AdminSections.SETTINGS, label: 'Settings', Icon: SettingsOutlinedIcon },
];

import { useNavigate } from 'react-router-dom';

export const SidebarAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
        dispatch(setActiveUser(null));
    };

    const renderListItem = (item) => (
        <StyledListItem
            key={item.id}
            isCurrentSection={location.pathname.endsWith(item.id)}
            onClick={() => (item.id === 'logout' ? handleLogout() : navigate(`/admin/${item.id}`))}
        >
            <StyledListItemIcon>
                <item.Icon style={{ color: 'floralwhite', fontSize: '1.25rem' }} />
            </StyledListItemIcon>
            <Typography color={'floralwhite'}>{item.label}</Typography>
        </StyledListItem>
    );

    return (
        <MainContainer>
            <List>
                <ListItem sx={{ display: 'flex', justifyContent: 'center', padding: 0, paddingRight: '5%' }}>
                    <img src="/lexi_logo.png" alt="logo" width={160} height={90} />
                </ListItem>
                <Divider style={{ backgroundColor: 'rgba(250,250,255,0.5)', marginBottom: '3vh' }} />
                {sectionsConfig.map(renderListItem)}
            </List>
            <ListItem button style={{ paddingLeft: '15%', marginBottom: '16px' }} onClick={handleLogout}>
                <Divider style={{ backgroundColor: 'floralwhite' }} />
                <StyledListItemIcon>
                    <ExitToAppOutlinedIcon style={{ color: 'floralwhite', fontSize: '1.25rem' }} />
                </StyledListItemIcon>
                <Typography color={'floralwhite'}>Logout</Typography>
            </ListItem>
        </MainContainer>
    );
};
