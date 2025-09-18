import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Container,
    Grid,
    Paper,
    Card,
    CardContent,
    CardMedia,
    Button,
    Avatar,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    IconButton,
    Badge,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Chip,
    Stack,
    Modal,
    Fade,
    Backdrop,
    Menu,
    MenuItem,
    Divider,
    LinearProgress,
    Link
} from '@mui/material';
import {
    Search,
    NotificationsOutlined,
    ChatBubbleOutline,
    ThumbUpOutlined,
    PushPin,
    MoreHoriz,
    AttachFile,
    InsertEmoticon,
    GifBoxOutlined,
    CategoryOutlined,
    ArrowDropDown,
    Event,
    ArrowBackIos,
    ArrowForwardIos,
    StarBorder,
    Lock,
    CalendarToday,
    CheckCircleOutline,
    LockOutlineSharp
} from '@mui/icons-material';

const posts = [
    { id: 1, author: 'Edward Honour', avatar: 'https://i.pravatar.cc/150?u=edward', tag: 'General Chat', time: '2d', title: 'Big Update: We\'ve Added 4 New Chats', content: 'Hey everyone! We are going to be making constant updates to this community, constant upgrades, etc. We have big plans for this community, so please stay tuned! To make things more organized and...', likes: 77, comments: 79, pinned: true, reactions: ['a', 'b', 'c'] },
    { id: 2, author: 'Edward Honour', avatar: 'https://i.pravatar.cc/150?u=edward', tag: 'General Chat', time: 'Sept 13, 2025', title: 'Video from Saturday\'s Session', content: null, likes: 22, comments: 15, pinned: false, reactions: ['d', 'e', 'f'], media: 'https://i.imgur.com/gKj4Qz5.png' },
    { id: 3, author: 'Andrea Pierini', avatar: 'https://i.pravatar.cc/150?u=andrea', tag: 'Building Tools (MCP)', time: '3d', title: 'My First MCP server in VS 2022', content: 'Hello everybody! Just made my First "Hello Word" MCP server in VS 2022. I started by installing the Microsoft AI template...', likes: 4, comments: 3, pinned: false, reactions: ['g', 'h', 'i'] },
];

const courses = [
    { title: 'AI Masters Introduction & Roadmap', description: 'Start Here on Your Road to Mastering AI.', progress: 50, image: 'https://i.ibb.co/5xtW6z6d/banner-2.jpg' },
    { title: 'General Overview', description: 'This course is the basic fundamentals everyone should know.', progress: 40, image: 'https://i.ibb.co/5xtW6z6d/banner-2.jpg' },
    { title: 'AI Foundations', description: 'Topics you will be glad you know', progress: 85, image: 'https://i.ibb.co/5xtW6z6d/banner-2.jpg' },
]

const members = [
    { name: "James O'Regan", handle: "@james-oregan-2675", avatar: "https://i.pravatar.cc/150?u=james-o", bio: "Hi I am James and I work for a software company in the end user computing industry as a product marketing manager and I host my company's podcast.", online: true, joined: "Sep 3, 2025" }, { name: "Fazilat Tariq", handle: "@fazilat-tariq-2416", avatar: "https://i.pravatar.cc/150?u=fazilat", bio: "An ordinary girl", online: false, active: "1m ago", joined: "Aug 18, 2025" },
    { name: "Midnite Love", handle: "@midnite-love-7779", avatar: "https://i.pravatar.cc/150?u=midnite", bio: "Author, Custom Party Favors, Digital Products. Teaching Gen X how to make money online.", online: false, active: "1m ago", joined: "Sep 17, 2025" }
]

const leaderboard7day = [{ name: 'James Utley PhD', score: '+16', avatar: 'https://i.pravatar.cc/150?u=james' }, { name: 'Avi Kumar', score: '+14', avatar: 'https://i.pravatar.cc/150?u=avi' }, { name: 'Andrea Pierini', score: '+8', avatar: 'https://i.pravatar.cc/150?u=andrea-p' }];
const leaderboard30day = [{ name: 'Avi Bhatt', score: '+113', avatar: 'https://i.pravatar.cc/150?u=avi' }, { name: 'Erik Fiala', score: '+19', avatar: 'https://i.pravatar.cc/150?u=erik' }, { name: 'Patricia Kelvin', score: '+19', avatar: 'https://i.pravatar.cc/150?u=patricia' }];
const leaderboardAllTime = [{ name: 'Avi Kumar', score: '340', avatar: 'https://i.pravatar.cc/150?u=avi' }, { name: 'James Utley PhD', score: '323', avatar: 'https://i.pravatar.cc/150?u=james' }, { name: 'Eugenia Ghelbur', score: '256', avatar: 'https://i.pravatar.cc/150?u=eugenia' }];

const notifications = [{ user: 'Edward Honour', action: '(following) new post', time: '4d', title: "Video from Saturday's Session" }, { user: 'Edward Honour', action: '(admin) new post', time: '6d', title: "Tomorrow's Live Call: The 90 Day AI Roadmap" }, { user: 'Edward Honour', action: '(following) new post', time: '19d', title: 'Live Event - 8/30' }];
const chats = [{ user: "Edward Honour", date: "Jul 8", message: "Hey Prem! Welcome to the AI Masters Community 👋", avatar: "https://i.pravatar.cc/150?u=edward" }]
const levelsData = [
  { level: 1, percentage: 93, unlocked: true, unlockAction: null },
  { level: 6, percentage: 0, unlocked: false, unlockAction: null },
  { level: 2, percentage: 3, unlocked: false, unlockAction: 'Unlock Chat with members' },
  { level: 7, percentage: 1, unlocked: false, unlockAction: null },
  { level: 3, percentage: 1, unlocked: false, unlockAction: null },
  { level: 8, percentage: 0, unlocked: false, unlockAction: null },
  { level: 4, percentage: 1, unlocked: false, unlockAction: null },
  { level: 9, percentage: 0, unlocked: false, unlockAction: null },
  { level: 5, percentage: 1, unlocked: false, unlockAction: null },
];

const CommunityFeed = ({ handleOpenPostModal }) => (
    <Stack spacing={3}>
        <Card onClick={handleOpenPostModal} sx={{ cursor: 'pointer' }}>
            <CardContent><Stack direction="row" spacing={2} alignItems="center"><Avatar src="https://i.pravatar.cc/150?u=me" /><Typography color="text.secondary">Write something...</Typography></Stack></CardContent>
        </Card>
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
            {['All', 'General Chat', 'Updates', 'Introductions'].map(c => (
                <Chip
                    key={c}
                    label={c}
                    variant={c === 'All' ? 'filled' : 'outlined'}
                    sx={{
                        bgcolor: c === 'All' ? '#333' : 'inherit',
                        color: c === 'All' ? '#fff' : 'inherit'
                    }}
                />
            ))}
            <Chip label="More..." variant="outlined" />
        </Stack>
        {posts.map((post) => (
            <Card key={post.id}>
                <CardContent>
                    <Stack direction="row" spacing={2}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Stack direction="row" justifyContent="space-between">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar src={post.avatar} />
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0, lineHeight: 'auto' }}>{post.author}</Typography>
                                        <Typography variant="caption" color="text.secondary">{post.tag} • {post.time}</Typography>
                                    </Box>
                                </Box>
                                <Stack direction="row" alignItems="center">
                                    {post.pinned && <PushPin fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />}
                                    <IconButton size="small"><MoreHoriz /></IconButton>
                                </Stack>
                            </Stack>
                            <Typography variant="h6" sx={{ mt: 1 }}>{post.title}</Typography>
                            {post.content && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{post.content}</Typography>}
                            {post.media && <CardMedia component="img" image={post.media} sx={{ borderRadius: 2, mt: 2 }} />}
                            <Stack direction="row" sx={{ mt: 2 }} alignItems="center">
                                <Button startIcon={<ThumbUpOutlined />} size="small" sx={{ color: 'text.secondary' }}>{post.likes}</Button>
                                <Button startIcon={<ChatBubbleOutline />} size="small" sx={{ color: 'text.secondary' }}>{post.comments}</Button>
                                <Stack direction="row" spacing={-1}>
                                    {post.reactions.map(r => <Avatar key={r} src={`https://i.pravatar.cc/150?u=${r}`} sx={{ width: 24, height: 24 }} />)}
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        ))}
    </Stack>
);

const ClassroomView = () => (
    <Grid container spacing={2}>
        {courses.map(course => (
            <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={course.title}>
                <Card>
                    <CardMedia component="img" height="200" image={course.image} alt={course.title} />
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>{course.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                            minHeight: 48,
                        }}>{course.description}</Typography>
                        <LinearProgress variant="determinate" value={course.progress} sx={{ height: 8, borderRadius: 4, mt: 2 }} />
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid >
);

const CalendarView = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dates = Array.from({ length: 30 }, (_, i) => i + 1);
    return (
        <Card>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Button variant="outlined">Today</Button>
                    <Stack direction="row" alignItems="center">
                        <IconButton><ArrowBackIos fontSize="small" /></IconButton>
                        <Typography variant="h6">September 2025</Typography>
                        <IconButton><ArrowForwardIos fontSize="small" /></IconButton>
                    </Stack>
                    <Box />
                </Stack>
                <Grid container columns={7}>{days.map(day => (
                    <Grid item size={{ xs: 1, md: 1 }} key={day} sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="body2" color="text.secondary">{day}</Typography>
                    </Grid>
                ))}
                    {dates.map(date => (
                        <Grid item size={{ xs: 1, md: 1 }} key={date} sx={{ border: '1px solid #e0e0e0', minHeight: 100, p: 1, bgcolor: date === 18 ? '#f0f0f0' : 'inherit' }}>
                            <Typography variant="body1" sx={{ fontWeight: date === 18 ? 700 : 400 }}>{date}</Typography>
                            {[6, 13, 20, 27].includes(date) && <Chip size="small" label="Weekly..." sx={{ mt: 1 }} />}
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

const MembersView = () => (
    <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
            <Chip label="Members 10093" variant="filled" sx={{ bgcolor: '#0F3C60', color: '#fff' }} />
            <Chip label="Admins 3" variant="outlined" />
            <Chip label="Online 26" variant="outlined" />
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" color="primary">Invite</Button>
        </Stack>
        {members.map(member => (
            <Card key={member.name}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">

                        <Box sx={{ flexGrow: 1 }}>
                            <Box className="member_card_header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "flex-start" }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar src={member.avatar} sx={{ width: 56, height: 56 }} />
                                    <Box>
                                        <Typography variant="h6">{member.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{member.handle}</Typography>
                                    </Box>
                                </Box>
                                <Button variant="outlined" size="small">Chat</Button>
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Typography variant="body2" sx={{ mt: 1 }}>{member.bio}</Typography>
                            </Box>
                            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                {member.online ? <Chip label="Online now" size="small" color="success" variant="outlined" /> : <Typography variant="caption" color='success'>Active {member.active}</Typography>}
                                <Chip label={`Joined ${member.joined}`} size="small" variant="outlined" />
                            </Stack>
                        </Box>

                    </Stack>
                </CardContent>
            </Card>
        ))}
    </Stack>
);

const LeaderboardsView = () => (
    <Stack spacing={3}>
        <Card>
            <CardContent sx={{ textAlign: 'center' }}>
                <Avatar src="https://i.pravatar.cc/150?u=me" sx={{ width: 80, height: 80, mx: 'auto', mb: 2, border: '4px solid orange' }} />
                <Typography variant="h5">Prem Mehta</Typography>
                <Chip label="Level 1" sx={{ mt: 1 }} />
                <Typography variant="caption" display="block" color="text.secondary">5 points to level up</Typography>
                <Box sx={{ bgcolor: 'background.default', p: 4, display: 'flex', justifyContent: 'center' }}>
                    <Container maxWidth="md">
                        <Paper>
                            <Grid container spacing={2}>
                                {levelsData.map((item) => (
                                    <Grid item xs={12} sm={6} key={item.level}>
                                        <List disablePadding>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Avatar sx={{
                                                        bgcolor: item.unlocked ? '#FFFBEB' : '#F3F4F6',
                                                        color: item.unlocked ? '#B45309' : 'text.secondary',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {item.unlocked ? item.level : <LockOutlineSharp />}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`Level ${item.level}`}
                                                    secondary={
                                                        item.unlockAction ? (
                                                            <>
                                                                <Link href="#" underline="hover">{item.unlockAction.split(' ')[1] + ' ' + item.unlockAction.split(' ')[2]}</Link>
                                                                {` ${item.percentage}% of members`}
                                                            </>
                                                        ) : (
                                                            `${item.percentage}% of members`
                                                        )
                                                    }
                                                    primaryTypographyProps={{ fontWeight: 'bold' }}
                                                />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Container>
                </Box>
            </CardContent>
        </Card>
        <Grid container spacing={3}>
            {[{ title: 'Leaderboard (7-day)', data: leaderboard7day }, { title: 'Leaderboard (30-day)', data: leaderboard30day }, { title: 'Leaderboard (all-time)', data: leaderboardAllTime },].map(board => (
                <Grid item size={{ xs: 12, md: 4 }} key={board.title}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{board.title}</Typography>
                            <List>
                                {board.data.map(m => (
                                    <ListItem key={m.name} disablePadding>
                                        <ListItemAvatar>
                                            <Avatar src={m.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText primary={m.name} secondary={m.score} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Stack>
);

const AboutView = () => (
    <Card>
        <CardMedia component="img" image="https://i.imgur.com/uG20I1s.png" alt="Welcome video" />
        <CardContent>
            <Stack direction="row" spacing={2} sx={{ borderBottom: '1px solid #e0e0e0', pb: 2, mb: 2 }}>
                <Chip icon={<Lock />} label="Private" variant="outlined" />
                <Chip icon={<StarBorder />} label="10k members" variant="outlined" />
                <Chip label="Free" variant="outlined" />
            </Stack>
            <Typography variant="body1" sx={{ my: 2 }}>AI is moving fast — don't just watch it happen. Learn how to master it. This is the free community for coders, creators, operators, and curious minds who want to understand AI, build with it, and get ahead while the world plays catch up.</Typography>
            <Typography variant="h6">Inside, you'll get:</Typography>
            <List sx={{ listStyleType: 'disc', pl: 4 }}>
                <ListItem sx={{ display: 'list-item', px:0 }}>Crash course in core AI concepts</ListItem>
                <ListItem sx={{ display: 'list-item', px:0 }}>Hands-on practice with tools, code, and real projects</ListItem>
                <ListItem sx={{ display: 'list-item', px:0 }}>Access to a network of sharp, motivated builders</ListItem>
            </List>
        </CardContent>
    </Card>
);

const RightSidebar = () => (
    <Stack spacing={3}>
        <Card>
            <CardMedia component="img" height="200" image="https://i.ibb.co/qYtwFDC6/banner.jpg" alt="Community Banner" />
            <CardContent sx={{ textAlign: 'left' }}>
                <Typography variant="h6">Cryptomanji</Typography>
                <Typography variant="caption" color="text.secondary">bellndesk.com/Cryptomanji</Typography>
                <Typography variant="body2" sx={{ my: 2 }}>A collaborative educational community where tech professionals at every stage of their career come together to master artificial intelligence.</Typography>
                <Stack direction="row" justifyContent="space-evenly" sx={{ my: 2 }} className=''>
                    <Box className="card_details_group"><Typography variant="h6" sx={{ lineHeight: 1 }}>10k</Typography><Typography variant="caption">Members</Typography></Box>
                    <Box className="card_details_group"><Typography variant="h6" sx={{ lineHeight: 1 }}>28</Typography><Typography variant="caption">Online</Typography></Box>
                    <Box className="card_details_group"><Typography variant="h6" sx={{ lineHeight: 1 }}>3</Typography><Typography variant="caption">Admins</Typography></Box>
                </Stack>
                <Button variant="outlined" fullWidth>Invite People</Button>
            </CardContent>
        </Card>
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Leaderboard (30-day)</Typography>
                <List disablePadding>{leaderboard30day.map((member) => (<ListItem key={member.name} disablePadding>
                    <ListItemAvatar>
                        <Avatar src={member.avatar} />
                    </ListItemAvatar>
                    <ListItemText primary={member.name} secondary={member.score} />
                </ListItem>))}
                </List>
                <Button fullWidth sx={{ mt: 1 }}>See all leaderboards</Button>
            </CardContent>
        </Card>
    </Stack>
);

const AiBellnDesk = () => {
    const [tabValue, setTabValue] = useState(0);
    const [openPostModal, setOpenPostModal] = useState(false);
    const [chatAnchor, setChatAnchor] = useState(null);
    const [notifAnchor, setNotifAnchor] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);

    const handleTabChange = (_, newValue) => setTabValue(newValue);
    const handleOpenPostModal = () => setOpenPostModal(true);
    const handleClosePostModal = () => setOpenPostModal(false);

    const handleMenuOpen = (setter) => (event) => setter(event.currentTarget);
    const handleMenuClose = (setter) => () => setter(null);

    const renderContent = () => {
        switch (tabValue) {
            case 0: return <CommunityFeed handleOpenPostModal={handleOpenPostModal} />;
            case 1: return <ClassroomView />;
            case 2: return <CalendarView />;
            case 3: return <MembersView />;
            case 4: return <Card><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2021171.7185316933!2d-81.6388085853078!3d8.342381187511716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa61583c8be2be3%3A0x79eee04d1fa59bcf!2sPanama!5e0!3m2!1sen!2sin!4v1758190007780!5m2!1sen!2sin" width="100%" height="500" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></Card>;
            case 5: return <LeaderboardsView />;
            case 6: return <AboutView />;
            default: return <CommunityFeed handleOpenPostModal={handleOpenPostModal} />;
        }
    };

    return (

        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <AppBar position="sticky" color="inherit" elevation={1} sx={{ bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters>
                        <Avatar src="https://i.ibb.co/gbd71fJ4/logo.jpg" sx={{ mr: 1, borderRadius: '4px' }} />
                        <Typography variant="h6" noWrap sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }}>Cryptomanji</Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: '300px',
                                    bgcolor: '#f1f1f1',
                                    borderRadius: '8px',
                                    '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } }
                                }}
                            />
                        </Box>
                        <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />
                        <IconButton size="large" color="inherit" onClick={handleMenuOpen(setChatAnchor)}>
                            <ChatBubbleOutline />
                        </IconButton>
                        <IconButton size="large" color="inherit" onClick={handleMenuOpen(setNotifAnchor)}>
                            <Badge badgeContent={25} color="error">
                                <NotificationsOutlined />
                            </Badge>
                        </IconButton>
                        <IconButton onClick={handleMenuOpen(setProfileAnchor)}>
                            <Avatar src="https://i.pravatar.cc/150?u=me" sx={{ ml: 2 }} />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            <Menu anchorEl={chatAnchor} open={Boolean(chatAnchor)} onClose={handleMenuClose(setChatAnchor)}>
                <List sx={{ width: 300 }}>
                    <ListItem>
                        <ListItemText primary="Chats" />
                    </ListItem>
                    <Divider />
                    {chats.map(c => (
                        <MenuItem key={c.user}>
                            <ListItemAvatar>
                                <Avatar src={c.avatar} />
                            </ListItemAvatar>
                            <ListItemText primary={c.user} secondary={c.message} />
                        </MenuItem>
                    ))}
                </List>
            </Menu>
            <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={handleMenuClose(setNotifAnchor)}>
                <List sx={{ width: 350 }}>
                    <ListItem>
                        <ListItemText primary="Notifications" />
                    </ListItem>
                    <Divider />
                    {notifications.map(n => (
                        <MenuItem key={n.title}>
                            <ListItemText primary={<>{n.user} <strong>{n.action}</strong></>} secondary={n.title} />
                        </MenuItem>
                    ))}
                </List>
            </Menu>
            <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={handleMenuClose(setProfileAnchor)}>
                {['Profile', 'Settings', 'Affiliates', 'Help Center', 'Log out'].map(item => <MenuItem key={item}>{item}</MenuItem>)}
            </Menu>

            <AppBar position="static" color="inherit" elevation={1} sx={{ bgcolor: 'background.paper', borderTop: '1px solid #e0e0e0' }}>
                <Container maxWidth="lg">
                    <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
                        {['Community', 'Classroom', 'Calendar', 'Members', 'Map', 'Leaderboards', 'About'].map(label => <Tab key={label} label={label} />)}
                    </Tabs>
                </Container>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, md: [1, 2, 4, 5].includes(tabValue) ? 12 : 8 }}>
                        {renderContent()}
                    </Grid>
                    {![1, 2, 4, 5].includes(tabValue) &&

                        <Grid item size={{ xs: 12, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                            <RightSidebar />
                        </Grid>
                    }
                </Grid>
            </Container>

            <Modal open={openPostModal} onClose={handleClosePostModal} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
                <Fade in={openPostModal}>
                    <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', md: 600 }, bgcolor: 'background.paper', boxShadow: 24, p: 3, borderRadius: 2, outline: 'none' }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Avatar src="https://i.pravatar.cc/150?u=me" />
                            <Typography>Prem Mehta posting in <strong>AI Masters Community with Ed</strong></Typography>
                        </Stack>
                        <TextField fullWidth label="Title" variant="outlined" sx={{ mb: 2 }} />
                        <TextField fullWidth multiline rows={4} label="Write something..." variant="outlined" />
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                            <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                                <IconButton><AttachFile /></IconButton>
                                <IconButton><InsertEmoticon /></IconButton>
                                <IconButton><GifBoxOutlined /></IconButton>
                                <Button endIcon={<ArrowDropDown />} startIcon={<CategoryOutlined />}>Select a category</Button>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Button onClick={handleClosePostModal}>Cancel</Button>
                                <Button variant="contained" sx={{ bgcolor: '#333', '&:hover': { bgcolor: '#555' } }}>Post</Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Fade>
            </Modal>
        </Box>


    );
};

export default AiBellnDesk;
