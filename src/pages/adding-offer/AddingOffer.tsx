import { Container, Button, Card, CardContent, TextField, IconButton, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import type React from "react";
import { useState, useEffect } from "react";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import type { SubmitHandler, FieldValues } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { RestEndPoints } from "../../enums/rest-endpoints.enums";
import { useNavigate } from 'react-router-dom';

const requestURL = 'http://localhost:80';

interface Subcategory {
  icon: string,
  iconType: string,
  id: number,
  title: string
}

interface Category {
  name: string,
  subCategoryList: Subcategory[]
  id: string,
  priority: number,
  documentId: string
}

interface FormData {
  title: string;
  description: string;
  expireDate: string;
  tags: string;
  category: string;
  subCategory: string;
  country: string;
  image: any;
  promotionUrl: string;
}

function AddingOffer() {
  const { register, handleSubmit, reset, control } = useForm<FormData>();
  const [ categories, setCategories ] = useState<Category[]>([]);
  const [ subCategories, setSubCategories ] = useState<Subcategory[]>([]);
  const [ isDisabled , setIsDisabled ] = useState(false);

  const [imagePreview, setImagePreview] = useState<string>("");
  const navigate = useNavigate();

  const removeImagePreview = () => {
    setImagePreview("");
  };

  const resetForm = () => {
    reset();
    removeImagePreview();
  }

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
        const response = await fetch(`${requestURL}${RestEndPoints.GetAllCategories}`, {
            method: "GET",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`${data.error}`);
        }
        if (data) {
            setCategories(data);
            const allSubCategories = data.flatMap((category: Category) => category.subCategoryList);
            setSubCategories(allSubCategories);
        }
    } catch (error) {
      alert(`Error fetching categories: ${error}`);
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsDisabled(true);
    const formData = new FormData();
  
    // Append form data
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("expireDate", data.expireDate);
    formData.append("tags", JSON.stringify(data.tags.split(",").map((word: string) => word.trim())));
    formData.append("category", data.category);
    formData.append("subCategory", data.subCategory);
    formData.append("country", data.country);
    formData.append("file", data.image[0]);
    formData.append("promotionUrl", data.promotionUrl);
  
    try {
      const response = await fetch(`${requestURL}${RestEndPoints.CreateOffer}`, {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
  
      if (response.ok && result?._path?.segments[1]) {
        alert('Success');
      } else {
        alert(`Operation failed: ${result.error}`);
      }
    } catch (error) {
      alert(`Request failed: ${error}`);
    } finally {
      resetForm();
      setIsDisabled(false);
    }
  };

  const handleCategoryChange = (event: any) => {
    if (event) {
      const categoryId = event.target.value as string;
      const category = categories.find(category => category.id === categoryId);
      if (category) {
        setSubCategories(category.subCategoryList);
      }
    }
  }

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card variant="outlined" sx={{ boxShadow: 3, padding: 2, maxWidth: 'auto', margin: 'auto' }}>
      <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField id="title" label="Title" {...register("title")} required />
            <TextField id="description" label="Description" multiline rows={4} {...register("description")}  />
            <TextField id="expireDate" label="Expire Date" type="date" InputLabelProps={{ shrink: true }} {...register("expireDate")} required />
            <TextField id="tags" label="Tags" {...register("tags")} required />
            <FormControl>
              <InputLabel id="category-label">Categories</InputLabel>
              <Controller name="category" control={control} render={({ field }) => (
                  <Select {...field} labelId="category-label" label="Categories"
                    onChange={(e) => {
                      field.onChange(e);
                      handleCategoryChange(e);
                    }} required>
                      {categories.map((category, index) => (
                        <MenuItem key={index} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
            </FormControl>
            <FormControl>
              <InputLabel id="sub-category-label">Sub Categories</InputLabel>
              <Select id="sub-category" labelId="sub-category-label" label="Sub Categories" {...register("subCategory")} required>
                {
                  subCategories && subCategories.map((subCategory, index) => 
                    <MenuItem key={index} value={subCategory.id}>{subCategory.title}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
            <TextField id="promotionUrl" label="Promotion Link" {...register("promotionUrl")} required />
            <FormControl>
              <InputLabel id="country-label">Countries</InputLabel>
              <Select id="country" labelId="country-label" label="Countries" {...register("country")} defaultValue="LK" required>
                <MenuItem value="LK">Sri Lanka</MenuItem>
                <MenuItem value="emirates">Emirates</MenuItem>
              </Select>
            </FormControl>
            <input type="file" id="image" {...register("image")} onChange={handleImageChange} required />
            {imagePreview && (
              <div>
                <img src={imagePreview} alt="" style={{ maxWidth: '100%', marginTop: '16px' }} />
                <IconButton color="error" aria-label="remove image" onClick={removeImagePreview}>
                  <HighlightOffIcon />
                </IconButton><div>Remove the Image</div>
              </div>
            )}
            <Button disabled={isDisabled} variant="contained" type="submit">Submit</Button>
            <Button disabled={isDisabled} variant="contained"  onClick={resetForm} color="secondary">Reset</Button>
            <Button disabled={isDisabled} variant="contained"  onClick={() => navigate('/')} color="secondary">Go to Home</Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AddingOffer;