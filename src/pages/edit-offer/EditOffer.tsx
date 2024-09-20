import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Grid, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import config from '../../config/config';

const requestURL = config.apiUrl;

const EditOffer = () => {
  const { state } = useLocation();  // Access passed offer data from state
  const [editedOffer, setEditedOffer] = useState({
    ...state.offer,
    tags: state.offer.tags.join(',')
  }
    );
  const [ categories, setCategories ] = useState(state.categories);
  const [selectedCategory, setSelectedCategory] = useState(editedOffer.category || ''); // Selected category ID
  const [selectedSubCategory, setSelectedSubCategory] = useState(editedOffer.subCategory || ''); // Selected subcategory ID
  const [subCategories, setSubCategories] = useState([]); // Subcategories for the selected category
  const navigate = useNavigate();

  useEffect(() => {
    // Load relevant subcategories when a category is selected
    const category = categories.find((cat: any) => cat.id === selectedCategory);
    if (category) {
      setSubCategories(category.subCategoryList || []);
    } else {
      setSubCategories([]); // Reset if no category is selected
    }
  }, [selectedCategory]);

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
    const updatedOffer = {
        ...editedOffer,
        tags: editedOffer.tags.split(','), // Convert comma-separated string to array
        expireDate: new Date(editedOffer?.expireDate?._seconds * 1000).toISOString().split('T')[0]
    };
    try {
      const response = await fetch(`${requestURL}/api/offer/update-offer?id=${editedOffer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOffer),
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
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setEditedOffer({
      ...editedOffer,
      category: e.target.value,
      subCategory: ''
    });
  };

  const handleSubCategoryChange = (e: any) => {
    setSelectedSubCategory(e.target.value);
    setEditedOffer({
      ...editedOffer,
      subCategory: e.target.value,
    });
  };

  return (
    <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4">
                    Edit Offer
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/')}
                >
                    Go to Home
                </Button>
            </Box>
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
                        value={selectedCategory}
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

                {subCategories.length > 0 && (
                    <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="subcategory-label">Subcategory</InputLabel>
                        <Select
                            labelId="subcategory-label"
                            id="subcategory"
                            name="subcategory"
                            value={selectedSubCategory}
                            onChange={handleSubCategoryChange}
                            label="Subcategory"
                        >
                            {subCategories.map((subCategory: any) => (
                                <MenuItem key={subCategory.id} value={subCategory.id}>
                                    {subCategory.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    </Grid>
                )}

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
