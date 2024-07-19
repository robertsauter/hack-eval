import { Code, Logout, ManageAccounts, Settings } from '@mui/icons-material';
import { AppBar, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { useEffect, useState } from 'react';
import { filtersService } from '../services/FiltersService';

export function Navbar() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | undefined>();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchor(e.currentTarget);
        setMenuOpen(true);
    };

    const handleCloseMenu = () => {
        setMenuOpen(false);
    };

    const handleLogoutClick = () => {
        userService.logout();
        handleCloseMenu();
    };

    useEffect(() => {
        const subscriptions = [
            userService.loggedIn$.subscribe((logged) => setLoggedIn(logged)),
            filtersService.filtersOpen$.subscribe((open) => setFiltersOpen(open))
        ];

        return () => {
            subscriptions.forEach((subscription) => subscription.unsubscribe());
        }
    }, []);

    return <AppBar>
        <Toolbar className={`flex items-center justify-between ${filtersOpen
            ? 'sm:pr-[13rem] md:pr-[19rem] lg:pr-[26rem] xl:pr-[31rem]'
            : ''
            }`} variant="dense">
            {loggedIn
                ? <>
                    <div className="flex items-center">
                        <Code />
                        <Typography className="mr-8">HackEval</Typography>
                        <Link to="/">
                            <Button className="text-white">Overview</Button>
                        </Link>
                        <Link to="/survey">
                            <Button className="text-white">Survey</Button>
                        </Link>
                    </div>
                    <div>
                        <IconButton onClick={handleOpenMenu} className="text-white">
                            <Settings />
                        </IconButton>
                        <Menu
                            open={menuOpen}
                            anchorEl={menuAnchor}
                            onClose={handleCloseMenu}>
                            <Link
                                to="/account"
                                onClick={handleCloseMenu}
                                className="text-inherit no-underline">
                                <MenuItem>
                                    <ListItemIcon>
                                        <ManageAccounts />
                                    </ListItemIcon>
                                    <ListItemText>Your account</ListItemText>
                                </MenuItem>
                            </Link>
                            <MenuItem onClick={handleLogoutClick}>
                                <ListItemIcon>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText>Logout</ListItemText>
                            </MenuItem>
                        </Menu>
                    </div>
                </>
                : <div className="flex items-center">
                    <Code />
                    <Typography>HackEval</Typography>
                </div>
            }
        </Toolbar>
    </AppBar>;
}