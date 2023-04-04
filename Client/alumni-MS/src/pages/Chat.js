import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect } from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Grid,
    Box,
    TextField,
    Autocomplete,
    List,
    ListItem,
    Alert,
    CircularProgress,
    Divider,
    ListItemText,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import { ENDPOINT } from './LoginPage';
import Drawer from '@mui/material/Drawer';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'id', label: 'id', alignRight: false },
    { id: 'Members', label: 'Members', alignRight: false },
    { id: 'Messages', label: 'Messages', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function Chat() {
    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');
    const [tempState, setTempState] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [myId, setMyId] = useState('');
    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    useEffect(() => {
        console.log(tempState)
    }, [tempState])

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [succ, setSucc] = useState(false);
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = USERLIST.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;
    const [secondStage, setSecondStage] = useState(false);
    const [myRows, setMyRows] = useState([]);
    const token = localStorage.getItem('token');
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const myFetch = async () => {

        const res = await fetch(`${ENDPOINT}/api/chat/chats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await res.json();
        const ourChat = data.filter((item) => {
            return item.participants.includes(user._id)
        });
        if (!res.ok) {
            return;
        }
        if (ourChat.length) {
            const res2 = await fetch(`${ENDPOINT}/api/chat/chats/${ourChat[0]._id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
            const data2 = await res2.json();
            if (!res2.ok) {
                return;
            }

            setCurrentChat(data2);
            setMessages(data2.messages);

            setIsLoading(false);
        } else {
            console.log('No chat found');
            setSecondStage(true);
            setIsLoading(false);
        }

    }
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });




    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const [data, setData] = useState({
        participants: [],

    })
    const [userOptions, setUserOptions] = useState([]);


    useEffect(() => {
        myFetch();
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            myFetch();
            console.warn('Sockets: getting Latest Messages')
        }, 5000);

        return () => clearInterval(interval);
    }, []);



    return !isLoading ? (
        <>
            <Helmet>
                <title> Chat Channels | Alumni Management System </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Chat
                    </Typography>

                </Stack>

                <Card sx={{
                    p: 3,
                    overflowY: 'auto',
                }}>
                    {Array.isArray(messages) && messages.length ? (
                        <>
                            <List sx={{ height: '600px', overflowY: 'auto' }}>
                                {messages.map((message, index) => {
                                    return (
                                        <ListItem key={index} sx={user._id === message.sender._id ? {
                                            flexDirection: 'row-reverse',
                                            width: 'fit-content',
                                            marginLeft: 'auto',
                                            gap: '1rem',
                                            textAlign: 'right'
                                        } : {
                                            widht: 'fit-content',
                                            marginRight: 'auto',
                                            gap: '1rem',
                                            textAlign: 'left'
                                        }

                                        } >
                                            <Avatar
                                                src=''
                                                alt={message.sender.first_name}
                                            />
                                            <ListItemText
                                                primary={message.sender.first_name}
                                                secondary={message.text}
                                            />
                                            <Divider />
                                        </ListItem>

                                    )
                                })}
                            </List>

                            <TextField
                                id="outlined-multiline-static"
                                label="Type a Message Here"
                                multiline
                                rows={4}
                                sx={{
                                    width: '100%',
                                    mt: 2

                                }}
                                variant="outlined"
                                onKeyPress={async (e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const res = await fetch(`${ENDPOINT}/api/chat/chats/${currentChat._id}/messages`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`
                                            },
                                            body: JSON.stringify({
                                                text: e.target.value,
                                            })
                                        });
                                        const data = await res.json();
                                        if (!res.ok) {
                                            console.log('Error sending message', messages)
                                            return;
                                        }
                                        setMessages([...messages, data]);
                                        e.target.value = '';
                                    }
                                }}
                            />

                        </>
                    ) : (
                        <>
                            <Typography variant="h6" gutterBottom>
                                {secondStage ? 'You are not part of any Chat' : 'No Messages Yet'}
                            </Typography>
                            {!secondStage && (
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Multiline"
                                    multiline
                                    rows={4}
                                    sx={{
                                        width: '100%',
                                        mt: 2

                                    }}
                                    variant="outlined"
                                    onKeyPress={async (e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const res = await fetch(`${ENDPOINT}/api/chat/chats/${currentChat._id}/messages`, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${token}`
                                                },
                                                body: JSON.stringify({
                                                    text: e.target.value,
                                                })
                                            });
                                            const data = await res.json();
                                            if (!res.ok) {
                                                console.log('Error sending message', messages)
                                                return;
                                            }
                                            setMessages([...messages, data]);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            )}
                        </>
                    )}

                </Card>
            </Container>
        </>
    ) : (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f4f6f8'
        }}>
            <CircularProgress />
        </div>

    );
}


