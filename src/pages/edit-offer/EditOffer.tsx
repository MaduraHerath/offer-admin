import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Grid, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EditOffer = () => {
  const { state } = useLocation();  // Access passed offer data from state
  const [editedOffer, setEditedOffer] = useState({
    ...state.offer,
    tags: state.offer.tags.join(',')
  }
    );
  const [ categories, setCategories ] = useState(state.categories);
  const navigate = useNavigate();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'valid_until') {
        const timestamp = new Date(value).getTime() / 1000;  // Convert date to seconds
        const expireDate = { _seconds: timestamp };
        setEditedOffer({
          ...editedOffer,
          expireDate: expireDate,  // Store the timestamp in seconds
        });
      } else {
        setEditedOffer({
          ...editedOffer,
          [name]: value,
        });
      }
  };

  const handleUpdateOffer = async () => {
    try {
      const response = await fetch(`https://api.example.com/offers/${editedOffer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedOffer),
      });
      if (!response.ok) {
        throw new Error('Failed to update offer');
      }
      // Navigate back to the offer list after update
      navigate('/');
    } catch (err) {
      console.error('Error updating offer:', err);
    }
  };

  const formatDate = (timestamp: any) => {
    return new Date(timestamp * 1000).toISOString().split('T')[0];
  };

  const handleCategoryChange = (e: any) => {
    setEditedOffer({
      ...editedOffer,
      category: e.target.value,
    });
  };

  return (
    <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h4" align="center">
                Edit Offer
            </Typography>
        </Box>
        <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={editedOffer.title}
                    onChange={handleInputChange}
                    variant="outlined"
                />
                </Grid>

                <Grid item xs={12}>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={editedOffer.description}
                    onChange={handleInputChange}
                    variant="outlined"
                />
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={editedOffer.category || ''}
                        onChange={handleCategoryChange}
                        label="Category"
                    >
                        {categories.map((category: any) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Tags (comma-separated)"
                        name="tags"
                        value={editedOffer.tags}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Promotion URL"
                        name="promotionUrl"
                        value={editedOffer.promotionUrl}
                        onChange={handleInputChange}
                        variant="outlined"
                    />
                </Grid>

                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Valid Until"
                    name="valid_until"
                    type="date"
                    value={formatDate(editedOffer.expireDate._seconds)}
                    onChange={handleInputChange}
                    InputLabelProps={{
                    shrink: true,
                    }}
                />
                </Grid>

                <Grid item xs={12}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateOffer}
                    sx={{ mt: 2 }}
                >
                    Save
                </Button>
                </Grid>
            </Grid>
        </Box>
    </Container>

  );
};

export default EditOffer;
