import React, { useState, useEffect } from 'react';

const OfferList = () => {
  const [offers, setOffers] = useState([]);  // To store fetched offers
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [category, setCategory] = useState('');  // Selected category state
  const [categories, setCategories] = useState([]);  // List of categories

  // Function to fetch offers based on selected category
  const fetchOffers = async (selectedCategory = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:80/api/offer/get-offers-by-category?category=${selectedCategory}`);  // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      const data = await response.json();
      console.log('offers list');
      console.log(data);
      setOffers(data);  // Update state with fetched data
    } catch (err) {
    //   setError(err.message);  // Set error if API call fails
    } finally {
      setLoading(false);  // Stop loading once data is fetched
    }
  };

  // Fetch categories on component mount
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:80/api/category/get-all-categories');  // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      console.log(data);

      setCategories(data);  // Set the categories in state
    } catch (err) {
    //   setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();  // Fetch categories when component mounts
  }, []);

  // Fetch offers whenever the category changes
  useEffect(() => {
    fetchOffers(category);  // Fetch offers when category is changed
  }, [category]);

  // Handle category change
  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);  // Update selected category
  };

  // Render loading, error, or the offer list
  if (loading) {
    return <div>Loading offers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp * 1000);  // Convert from seconds to milliseconds
    return date.toISOString().split('T')[0];  // Get YYYY-MM-DD format
  };

  return (
    <div>
      <h1>Available Offers</h1>

      {/* Category filter dropdown */}
      <div>
        <label htmlFor="category">Filter by Category: </label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="">Select category</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Offer list */}
      <ul>
        {offers.map((offer: any) => (
          <li key={offer.id}>
            <h2>{offer.title}</h2>
            <p>{offer.description}</p>
            {offer.promotionUrl && (
              <p>
                <a href={offer.promotionUrl} target='_blank' rel="noopener noreferrer">
                  View promotion URL
                </a>
              </p>
            )}

            {offer.imageUrl && (
              <p>
                <a href={offer.imageUrl} target='_blank' rel="noopener noreferrer">
                  View Image URL
                </a>
              </p>
            )}
            
            <p>Valid until: {formatDate(offer.expireDate?._seconds)}</p>
            {offer.tags}

            {/* {
              offer.tags.map((tag: any) => (

              ))

            } */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfferList;
