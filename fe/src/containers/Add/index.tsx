import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

import jwt_decode from "jwt-decode";

import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../configs/Constants';
import { useTokenChecker } from '../../hooks';

const defaultTheme = createTheme();

const Add: React.FC = () => {
    const [errors, setErrors] = useState({ task: false, priority: false, due: false });
    const [priority, setPriority] = useState<string>('');

    const showNotification = useNotification();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useTokenChecker(token)

    const handlePriorityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPriority(event.target.value as string);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const task = data.get('task'); // New field: task
        const priority = data.get('priority'); // New field: priority
        const due = data.get('due'); // New field: due

        setErrors({
            task: !task, // Check for task field
            priority: !priority, // Check for priority field
            due: !due, // Check for due field
        });

        if (task && priority && due) {
            const actualToken = token!.slice(7); // Remove 'Bearer ' prefix
            const decodedToken = jwt_decode(actualToken);
            
            const data = {
                todoTask: task,
                todoPriority: priority,
                todoDue: due,
            };

            try {
                const fetching = await fetch(BASE_URL + '/todo/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data),
                });
                if (!fetching.ok) {
                    throw new Error('Error add task');
                }

                showNotification('success', 'Task Added', 'Task added successfully');
                navigate('/');
            } catch (error) {
                showNotification('error', 'Task Error', 'Task information is wrong');
            }
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Add Task
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, height: '50vh' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="task"
                            label="Task"
                            name="task"
                            error={errors.task} // Add error handling for the "task" field
                            helperText={errors.task ? "Task must be filled" : ""}
                        />
                        <FormControl fullWidth margin="normal" required error={errors.priority}>
                            <InputLabel id="priority-label">Priority</InputLabel>
                            <Select
                                labelId="priority-label"
                                id="priority"
                                name="priority"
                                value={priority}
                                onChange={handlePriorityChange as never}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                            {errors.priority ? (
                                <FormHelperText>Priority must be filled</FormHelperText>
                            ) : null}
                        </FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="due"
                            label="Due Date"
                            name="due"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            error={errors.due} // Add error handling for the "due" field
                            helperText={errors.due ? "Due Date must be filled" : ""}
                        />

                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Add Task
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link variant="body2" onClick={() => navigate('/')}>
                                    {"Back to Main Menu"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Add;
