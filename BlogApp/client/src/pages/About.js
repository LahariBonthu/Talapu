import React from "react";
import { Box, Typography } from "@mui/material";

const About = () => {
    return (
        <Box
            sx={{
                position: "fixed",  // Positioning fixed to stay at the bottom
                bottom: "0",        // Align to bottom
                left: "0",          // Align to left
                maxWidth: "800px",
                margin: "1rem",     // Space from the edges
                padding: "2rem",
                borderRadius: "10px",
                textAlign: "left",  // Align text to the left

            }}
        >
            <Typography
                variant="h2"
                sx={{
                    fontSize: "40px",
                    fontWeight: 400,
                    color: "#7e57c2",
                    fontFamily: "'Ubuntu', cursive",
                    marginBottom: "1.5rem",
                }}
            >

            </Typography>

            <Typography
                variant="body1"
                sx={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "#333",
                    fontFamily: "'Comic Relief', sans-serif",
                    display: "block",
                    marginBottom: "1rem"
                }}
            >
                Talapu — a spark of thought, a fleeting idea, a memory worth cherishing.
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "#333",
                    fontFamily: "'Comic Relief', sans-serif",
                    display: "block",
                    marginBottom: "1rem"
                }}
            >
                This platform is exactly the same.
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "#333",
                    fontFamily: "'Comic Relief', sans-serif",
                    display: "block",
                    marginBottom: "1rem"
                }}
            >
                In a world where everyone has something to say, Talapu offers a peaceful corner of the internet to put your words into the world.
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "#333",
                    fontFamily: "'Comic Relief', sans-serif",
                    display: "block",
                    marginBottom: "1rem"
                }}
            >
                Whether you're here to journal your daily life, write stories, document memories, express opinions, or simply explore what others are thinking — Talapu is for you.
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    color: "#333",
                    fontFamily: "'Comic Relief', sans-serif",
                    display: "block",
                    marginBottom: "1rem"
                }}
            >
                Happy Blogging!
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    fontSize: "1rem",
                    color: "#7e57c2",
                    fontFamily: "'Comic Relief', sans-serif",
                    display: "block",
                    marginTop: "2rem",
                    fontStyle: "italic"
                }}
            >
                For any queries, feel free to reach out to me at:
                {" "}
                <a
                    href="mailto:laharibonthu1882@gmail.com"
                    style={{ color: "#333", textDecoration: "none" }}
                >
                    laharibonthu1882@gmail.com
                </a>
            </Typography>
        </Box>
    );
};

export default About;

