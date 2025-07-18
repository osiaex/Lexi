import FontSizeSwitch from '@components/common/FontSizeSwitch';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { Box, ListItem } from '@mui/material';
import { ListItemText, StyledListItemIcon } from '../../../Admin/components/sidebar-admin/SideBar.s';
import { StyledList, StyledListItem } from './SideBarChat.s';

interface SidebarProps {
    setIsOpen: (open: boolean) => void;
    setMessageFontSize: (size: 'sm' | 'lg') => void;
    messageFontSize: 'sm' | 'lg';
}

export const SidebarChat: React.FC<SidebarProps> = ({ 
    setIsOpen, 
    messageFontSize, 
    setMessageFontSize
}) => (
    <StyledList>
        <Box>
            <StyledListItem onClick={() => setIsOpen(true)}>
                <StyledListItemIcon>
                    <ExitToAppOutlinedIcon />
                    <ListItemText>Finish</ListItemText>
                </StyledListItemIcon>
            </StyledListItem>
            <ListItem>
                <ListItemText textAlign={'left'} sx={{ fontSize: '0.875rem' }}>
                    To conclude, click 'Finish' and complete a short questionnaire. Thank you for your cooperation!
                </ListItemText>
            </ListItem>
        </Box>
        
        <Box paddingLeft={'16px'}>
            <ListItemText width={'80%'} textAlign={'left'} sx={{ fontSize: '0.875rem' }}>
                Font Size:
            </ListItemText>
            <FontSizeSwitch fontSize={messageFontSize} setFontSize={setMessageFontSize} />
        </Box>
    </StyledList>
);
