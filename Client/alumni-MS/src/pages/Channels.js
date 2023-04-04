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
    Alert
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

export default function Channels() {
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

    const [myRows, setMyRows] = useState([]);
    const token = localStorage.getItem('token');

    const myFetch = async () => {
        const res = await fetch(`${ENDPOINT}/api/chat/chats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await res.json();
        if (!res.ok) {
            console.log(data.error);
            return;
        }

        const myData = data;
        setMyRows(myData)
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
    const myFetch2 = async () => {
        const res = await fetch(`${ENDPOINT}/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await res.json();
        if (!res.ok) {
            console.log(data.error);
            return;
        }

        setUserOptions([...data.alumnis, ...data.students])
    }

    useEffect(() => {
        myFetch();
        myFetch2();
    }, [])


    return (
        <>
            <Helmet>
                <title> Chat Channels | Alumni Management System </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Chat Channels
                    </Typography>
                    {['bottom'].map((anchor) => (
                        <React.Fragment key={anchor}>
                            <Button variant="contained" onClick={toggleDrawer(anchor, true)} >
                                New
                            </Button>

                            <Drawer
                                anchor={anchor}
                                open={state[anchor]}
                                onClose={toggleDrawer(anchor, false)}
                            >
                                <Grid container direction="column" alignItems="flex-start" sx={{ padding: '0.44rem 2rem' }}>
                                    <h1>New Channel</h1>
                                </Grid>
                                <Stack spacing={3} sx={{ padding: '0.44rem 2rem', width: '95%' }}>
                                    <h2>Add Members</h2>
                                    {Array.isArray(userOptions) && userOptions.length ?
                                        (
                                            <List sx={{
                                                height: '500px',
                                                overflow: 'auto'
                                            }}>
                                                {userOptions.map((item) => (
                                                    <ListItem key={item._id}>
                                                        <Checkbox onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setTempState([...tempState, item._id])
                                                            } else {

                                                                const index = tempState.indexOf(item._id);
                                                                if (index > -1) {
                                                                    tempState.splice(index, 1);
                                                                }
                                                                setTempState([...tempState])

                                                            }
                                                        }} />
                                                        {item.first_name}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : 'No Users'}
                                    {isError && <Alert severity="error">{errorMessage}</Alert>}
                                    {succ && <Alert severity="success">Chat Channel Successfully Created</Alert>}
                                    <Button variant="contained" onClick={async (e) => {
                                        e.preventDefault();
                                        const res = await fetch(`${ENDPOINT}/api/chat/chats`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`
                                            },
                                            body: JSON.stringify({
                                                participants: tempState
                                            })
                                        })
                                        const Rdata = await res.json();
                                        if (!res.ok) {
                                            setIsError(true);
                                            setErrorMessage(Rdata.error);
                                            console.log(Rdata);
                                            return;
                                        }
                                        setSucc(true);
                                        toggleDrawer(anchor, false);
                                        myFetch();

                                    }} >
                                        Save
                                    </Button>

                                </Stack>
                            </Drawer>
                        </React.Fragment>
                    ))}
                </Stack>

                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={USERLIST.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {Array.isArray(myRows) && myRows.length ? myRows.map((row) => {
                                        const { _id, participants, messages } = row;
                                        const selectedUser = selected.indexOf(_id) !== -1;

                                        return (
                                            <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {_id}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{Array.isArray(participants) && participants.length ? participants.length : 0}</TableCell>

                                                <TableCell align="left">{Array.isArray(messages) && messages.length ? messages.length : 0}</TableCell>



                                                <TableCell align="left">
                                                    <Label color={'success'}>{sentenceCase('Active')}</Label>
                                                </TableCell>

                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={(e) => {
                                                        setMyId(_id);
                                                        handleOpenMenu(e)

                                                    }}>
                                                        <Iconify icon={'eva:more-vertical-fill'} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }) : null}

                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br /> Try checking for typos or using complete words.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={USERLIST.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} onClick={async () => {
                        const res = await fetch(`${ENDPOINT}/api/users/${myId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                is_active: true,
                            }),
                        });

                        const data = await res.json();
                        if (!res.ok) {
                            console.log(data.error);
                            return;
                        }
                        myFetch();
                    }} />
                    Activate
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }} onClick={async () => {
                    const res = await fetch(`${ENDPOINT}/api/users/delete/${myId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },

                    });

                    const data = await res.json();
                    if (!res.ok) {
                        console.log(data.error);
                        return;
                    }
                    myFetch();
                }}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
}
