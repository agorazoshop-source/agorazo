import React from 'react';

interface CategoryDisplayProps {
  categories: any[]; // Array of category objects or references
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ categories }) => {
  // Handle null or undefined
  if (!categories || categories.length === 0) {
    return <span>General</span>;
  }
  
  // Handle case when categories is an array of references
  if (Array.isArray(categories)) {
    // If it's an array of reference objects with _ref
    if (categories.length > 0 && typeof categories[0] === 'object' && '_ref' in categories[0]) {
      return <span>Multiple Categories</span>;
    }
    
    // If it's an array of category objects with title
    if (categories.length > 0 && typeof categories[0] === 'object' && 'title' in categories[0]) {
      return <span>{categories[0].title}</span>;
    }
    
    // If it's an array of strings
    if (categories.length > 0 && typeof categories[0] === 'string') {
      return <span>{categories[0]}</span>;
    }
  }
  
  // Handle case when categories is a single object
  if (typeof categories === 'object' && !Array.isArray(categories)) {
    if ('title' in categories) {
      return <span>{categories.title}</span>;
    }
    if ('_ref' in categories) {
      return <span>Category</span>;
    }
  }
  
  // Handle case when categories is a string
  if (typeof categories === 'string') {
    return <span>{categories}</span>;
  }
  
  // Fallback for any other case
  return <span>General</span>;
};

export default CategoryDisplay;
