import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';




// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Authentication() {



    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");


    const [formState, setFormState] = React.useState(0);

    const [open, setOpen] = React.useState(false)




    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleAuth = async () => {
        try {

            if (formState === 0) {

                const result = await handleLogin(username, password);

                console.log(result);

                setUsername("");
                setPassword("");
                setError("");

            } else {

                const result = await handleRegister(
                    name,
                    username,
                    password
                );

                console.log(result);

                setUsername("");
                setPassword("");
                setName("");
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0);
            }

        } catch (err) {

            console.log(err);

            setError(
                err.response?.data?.message || "Something went wrong"
            );
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />

            <Grid container sx={{ height: "100vh" }}>

                {/* LEFT SIDE LOGIN */}
                <Grid
                    size={{ xs: 12, sm: 5 }}
                    component={Paper}
                    elevation={6}
                    square
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <div>
                            <Button
                                variant={formState === 0 ? "contained" : "text"}
                                onClick={() => setFormState(0)}
                            >
                                Sign In
                            </Button>

                            <Button
                                variant={formState === 1 ? "contained" : "text"}
                                onClick={() => setFormState(1)}
                                sx={{ ml: 1 }}
                            >
                                Sign Up
                            </Button>
                        </div>

                        <Box component="form" noValidate sx={{ mt: 1 }}>

                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <p style={{ color: "red" }}>{error}</p>

                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>

                        </Box>
                    </Box>
                </Grid>

                {/* RIGHT SIDE IMAGE */}
                <Grid
                    size={{ xs: 0, sm: 7 }}
                    sx={{
                        display: { xs: "none", sm: "block" },
                        backgroundImage:
                            "url('https://picsum.photos/1200/900')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                message={message}
            />

        </ThemeProvider>
    );
}