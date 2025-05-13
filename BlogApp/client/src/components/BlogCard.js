import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Modal, Collapse, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import "../assets/styles/components/BlogCard.css";


export default function BlogCard({
    title = "",
    description = "",
    image = "",
    username = "",
    time = new Date().toISOString(),
    id,
    isUser = false,
}) {
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [showFullDesc, setShowFullDesc] = React.useState(false);

    const avatarChar = username?.charAt(0)?.toUpperCase() || "A";

    const formattedTime = React.useMemo(() => {
        try {
            return new Date(time).toLocaleString();
        } catch {
            return "Unknown time";
        }
    }, [time]);

    const handleExpandClick = () => setExpanded(!expanded);
    const handleEdit = () => navigate(`/blog-details/${id}`);

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`/api/v1/blog/delete-blog/${id}`);
            if (data?.success) {
                alert("Blog Deleted");
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleImageClick = () => image && setOpen(true);
    const handleClose = () => setOpen(false);
    const toggleDescription = () => setShowFullDesc(!showFullDesc);

    const truncateDescription = (text, maxLength = 100) => {
        if (!text) return "";
        return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
    };

    return (
        <>
            <Card className="blog-card">
                {isUser && (
                    <Box className="blog-card-actions">
                        <IconButton onClick={handleEdit}>
                            <ModeEditIcon color="info" />
                        </IconButton>
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </Box>
                )}
                <CardHeader
                    className="blog-card-header"
                    avatar={
                        <Avatar
                            className="blog-avatar"
                            sx={{
                                bgcolor: '#a97ce0',
                                borderRadius: '80px',
                                width: 30,
                                height: 30
                            }}
                        >
                            {avatarChar}
                        </Avatar>

                    }

                    titleTypographyProps={{
                        sx: { fontFamily: "'Caveat'", fontWeight: 300, fontSize: '36px', color: '#ff135e' }
                    }}

                    title={username}

                />

                {image && (
                    <CardMedia
                        className="blog-card-media"
                        component="img"
                        height="194"
                        image={image}
                        alt={title || "Blog image"}
                        onClick={handleImageClick}
                    />
                )}
                <CardContent className="blog-card-content">
                    <Typography className="blog-title" variant="h6" gutterBottom>
                        {title || "Untitled Post"}
                    </Typography>
                    <Typography className="blog-description" variant="body2" color="text.secondary">
                        {showFullDesc ? description : truncateDescription(description)}
                    </Typography>
                    {description?.length > 100 && (
                        <Button className="blog-toggle-btn" size="small" onClick={toggleDescription}>
                            {showFullDesc ? 'Show Less' : 'Read More'}
                        </Button>
                    )}
                </CardContent>
                <CardActions className="blog-card-expand" disableSpacing>
                    <IconButton
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        className={`expand-icon ${expanded ? "expanded" : ""}`}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit className="blog-collapse-section">
                    <CardContent>
                        <Typography
                            paragraph
                            sx={{ fontFamily: "'Ubuntu', sans-serif", fontWeight: "medium", fontSize: "18px", color: "#444" }}
                        >
                            Details:
                        </Typography>
                        <div className="author-details">
                            <span className="author-name">Author: {username}</span>
                            <span className="author-time">Created: {formattedTime}</span>
                        </div>
                    </CardContent>
                </Collapse>
            </Card>

            {image && (
                <Modal open={open} onClose={handleClose} className="blog-image-modal">
                    <Box className="blog-modal-box">
                        <IconButton className="blog-modal-close-btn" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                        <img className="blog-modal-image" src={image} alt={title || "Blog image"} />
                    </Box>
                </Modal>
            )}
        </>
    );
}


