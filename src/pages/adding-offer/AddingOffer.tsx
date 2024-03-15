import { Container, Button, styled, Card, CardContent, Typography, TextField, IconButton, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function AddingOffer() {
  const { register, handleSubmit,reset  } = useForm();

  const [imagePreview, setImagePreview] = useState(null);

  const removeImagePreview = () => {
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (data) => {
    const formData = new FormData();
    console.log("data",data)
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("expireDate", data.expireDate);
    formData.append("tags", `[${data.tags.split(",").map((word: any) => `"${word}"`)}]`);
    formData.append("category", data.category);
    formData.append("country", data.country);

    formData.append("file", data.image[0]);

    formData.append("promotionUrl", data.promotionLink);

    const res = await fetch("https://my-offers-backend.onrender.com/api/offer/create-offer", {
      method: "POST",
      body: formData,
      headers: {
        // No need to set 'Content-Type' header when using FormData
      }
    }).then((res) => res.json());
    alert(JSON.stringify(`${res.message}, status: ${res.status}`));
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card variant="outlined" sx={{ boxShadow: 3, padding: 2, maxWidth: 'auto', margin: 'auto' }}>
      <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField id="title" label="Title" {...register("title")} required />
            <TextField id="description" label="Description" multiline rows={4} {...register("description")}  />
            <TextField id="expireDate" label="Expire Date" type="date" InputLabelProps={{ shrink: true }} {...register("expireDate")} required />
            <TextField id="tags" label="Tags" {...register("tags")} required />
            <TextField id="category" label="Category" type="number" {...register("category")} required />
            <TextField id="promotionLink" label="Promotion Link" {...register("promotionLink")} required />
            <Select id="country" label="Country" {...register("country")} defaultValue="" required>
              <MenuItem value="SL">Sri Lanka</MenuItem>
              <MenuItem value="emirates">Emirates</MenuItem>
            </Select>
            <input type="file" id="image" {...register("image")} onChange={handleImageChange} required />
            {imagePreview && (
              <div>
                <img src={imagePreview} alt="Image Preview" style={{ maxWidth: '100%', marginTop: '16px' }} />
                <IconButton color="error" aria-label="remove image" onClick={removeImagePreview}>
                  <HighlightOffIcon />
                </IconButton><div>Remove the Image</div>
              </div>
            )}
            <Button variant="contained" type="submit">Submit</Button>
            <Button variant="contained"  onClick={()=> reset()} color="secondary">Reset</Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AddingOffer;