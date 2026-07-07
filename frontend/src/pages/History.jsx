import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import Box from "@mui/material/Box";


export default function History() {


    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([]);

    const routeTo = useNavigate();



    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const history = await getHistoryOfUser();

                setMeetings(history || []);

            }
            catch (error) {

                console.log(error);

            }

        }


        fetchHistory();

    }, [getHistoryOfUser]);




    const formatDate = (dateString) => {

        const date = new Date(dateString);

        return `${date.getDate()
            .toString()
            .padStart(2, "0")}/${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${date.getFullYear()}`;

    }




    return (

        <Box sx={{ p: 3 }}>


            <IconButton
                onClick={() => routeTo("/home")}
            >

                <HomeIcon />

            </IconButton>



            {
                meetings.length > 0 ?

                    meetings.map((meeting, index) => (

                        <Card
                            key={meeting._id || index}
                            variant="outlined"
                            sx={{
                                mb: 2
                            }}
                        >


                            <CardContent>


                                <Typography
                                    color="text.secondary"
                                    gutterBottom
                                >

                                    Meeting Code:
                                    {meeting.meetingCode}

                                </Typography>



                                <Typography
                                    color="text.secondary"
                                >

                                    Date:
                                    {formatDate(meeting.date)}

                                </Typography>



                            </CardContent>


                        </Card>


                    ))


                    :

                    <Typography>
                        No meeting history found
                    </Typography>


            }



        </Box>

    )

}