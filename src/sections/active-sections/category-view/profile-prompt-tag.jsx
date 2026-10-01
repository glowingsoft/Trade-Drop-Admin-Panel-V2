import { Box, Button, Card, CardContent, CardHeader, Chip, TextField } from '@mui/material';
import React, { useState } from 'react'
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';

const ProfilePromptTag = ({ list, title, icon }) => {

    const [promptTag, setPromptTag] = useState("");

    const [data, setData] = useState(list);

    const [currentpromptTag, setCurrentpromptTag] = useState(null);

    const confirm = useBoolean();

    const handleClick = (item) => {
        setCurrentpromptTag(item);
        confirm.onTrue();
    }

    const handleAdd = () => {

        if (!promptTag) return;

        setData([...data, promptTag]);
    }


    return (
        <Card>
            <CardHeader title={title} avatar={<Iconify icon={icon} />} />

            <CardContent>
                {data?.map((item, index) => (
                    <Label
                        key={index}
                        variant="outlined"
                        color="primary"
                        sx={{ m: 0.5, p: 1 }}
                        endIcon={<Iconify icon="eva:close-fill" onClick={() => handleClick(item)} sx={{ ml: 0.5, cursor: "pointer" }} />}
                    >{item}</Label>
                ))}

                <Box sx={{ display: 'flex', alignItems: 'end', gap: 2, mt: 2 }}>
                    <TextField
                        value={promptTag}
                        size="small"

                        onChange={(e) => setPromptTag(e.target.value)}
                        placeholder='e.g Weekend availablity'
                        sx={{ flex: 1, width: 1 }}
                    />
                    <Button variant="outlined" onClick={handleAdd}>Add</Button>
                </Box>
            </CardContent>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete Prompt Tag"
                content="Are you sure you want to delete this prompt tag?"
                action={
                    <Button variant="contained" color="error" onClick={confirm.onTrue}>
                        Delete
                    </Button>
                }
            />

        </Card>
    )
}

export default ProfilePromptTag