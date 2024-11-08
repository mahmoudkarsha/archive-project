import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function VideosPreviewer({ files, deleteFile }) {
    return (
        <ImageList sx={{ width: '100%', height: 300 }}>
            {files.map((item) => (
                <ImageListItem key={item.preview}>
                    <video autoPlay loop muted height={'300px'}>
                        <source src={item.preview} type="video/mp4" />
                    </video>

                    <ImageListItemBar
                        title={item.file.name}
                        // subtitle={item.preview}
                        actionIcon={
                            <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                aria-label={`info about ${item.title}`}
                                onClick={() => {
                                    deleteFile(item.preview);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}
