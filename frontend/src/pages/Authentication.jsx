import * as React from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import { Snackbar } from "@mui/material";


const defaultTheme = createTheme();


export default function Authentication() {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");

    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");

    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const {
        handleRegister,
        handleLogin
    } = React.useContext(AuthContext);



    const handleAuth = async () => {

        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Username and password are required");
            return;
        }


        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }


        if (formState === 1 && !name.trim()) {
            setError("Name is required");
            return;
        }


        try {

            setLoading(true);


            if (formState === 0) {

                await handleLogin(
                    username.trim(),
                    password
                );


                setUsername("");
                setPassword("");

            }
            else {

                const result = await handleRegister(
                    name.trim(),
                    username.trim(),
                    password
                );


                setMessage(result);
                setOpen(true);

                setName("");
                setUsername("");
                setPassword("");

                setFormState(0);
            }


        }
        catch (err) {

            setError(
                err.response?.data?.message ||
                "Something went wrong"
            );

        }
        finally {
            setLoading(false);
        }

    }



    return (

        <ThemeProvider theme={defaultTheme}>

            <CssBaseline />


            <Grid container sx={{ height: "100vh" }}>


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
                            alignItems: "center"
                        }}
                    >


                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>



                        <div>

                            <Button
                                variant={
                                    formState === 0 ?
                                        "contained" :
                                        "text"
                                }
                                onClick={() => setFormState(0)}
                            >
                                Login
                            </Button>



                            <Button
                                variant={
                                    formState === 1 ?
                                        "contained" :
                                        "text"
                                }
                                onClick={() => setFormState(1)}
                                sx={{ ml: 1 }}
                            >
                                Register
                            </Button>

                        </div>



                        <Box
                            component="form"
                            sx={{ mt: 1 }}
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAuth();
                            }}
                        >



                            {
                                formState === 1 &&

                                <TextField

                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Full Name"

                                    value={name}

                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError("");
                                    }}

                                />

                            }



                            <TextField

                                margin="normal"
                                required
                                fullWidth

                                label="Username"

                                value={username}

                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError("");
                                }}

                            />



                            <TextField

                                margin="normal"
                                required
                                fullWidth

                                label="Password"

                                type="password"

                                value={password}

                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}

                            />



                            {
                                error &&
                                <p style={{ color: "red" }}>
                                    {error}
                                </p>
                            }



                            <Button

                                type="submit"

                                fullWidth

                                variant="contained"

                                disabled={loading}

                                sx={{ mt: 3, mb: 2 }}

                            >

                                {
                                    loading
                                        ?
                                        "Please wait..."
                                        :
                                        formState === 0
                                            ?
                                            "Login"
                                            :
                                            "Register"
                                }


                            </Button>



                        </Box>


                    </Box>


                </Grid>





                <Grid

                    size={{ xs: 0, sm: 7 }}

                    sx={{

                        display: {
                            xs: "none",
                            sm: "block"
                        },

                        backgroundImage:
                            "url('https://picsum.photos/1200/900')",

                        backgroundSize: "cover",

                        backgroundPosition: "center"

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

    )

}