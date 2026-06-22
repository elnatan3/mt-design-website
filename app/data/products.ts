export type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    sizes: string[];
    colors: { name: string; value: string }[];
    description: string;
    availability: string;
    stock: number;
    rating: number;
    reviews: number;
    delivery: string;
  };
  
  export const products: Product[] = [
    {
      id: "MT-001",
      name: "Royal Wedding Kemis",
      category: "Wedding",
      price: 250,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Gold", value: "#f5c542" },
        { name: "Blue", value: "#0b3d91" },
        { name: "Green", value: "#166534" },
        { name: "Red", value: "#b91c1c" },
      ],
      description:
        "Elegant white Habesha kemis with premium Tibeb detail for weddings.",
      availability: "In Stock",
      stock: 4,
      rating: 4.9,
      reviews: 28,
      delivery: "Ships in 5–7 days",
    },
    {
      id: "MT-002",
      name: "Graduation Blue Tibeb Dress",
      category: "Graduation",
      price: 180,
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { name: "Blue", value: "#0b3d91" },
        { name: "Gold", value: "#f5c542" },
        { name: "Purple", value: "#7e22ce" },
      ],
      description:
        "Modern graduation dress with beautiful Ethiopian Tibeb detail.",
      availability: "Limited Stock",
      stock: 2,
      rating: 4.8,
      reviews: 19,
      delivery: "Ships in 3–5 days",
    },
    {
      id: "MT-003",
      name: "Classic Gold Habesha Kemis",
      category: "Traditional",
      price: 160,
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Gold", value: "#f5c542" },
        { name: "Red", value: "#b91c1c" },
        { name: "Green", value: "#166534" },
      ],
      description:
        "Classic Ethiopian traditional dress for cultural occasions.",
      availability: "In Stock",
      stock: 6,
      rating: 5.0,
      reviews: 34,
      delivery: "Ships in 5–7 days",
    },
    {
      id: "MT-004",
      name: "Modern Habesha Dress",
      category: "Modern",
      price: 200,
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { name: "Gold", value: "#f5c542" },
        { name: "Blue", value: "#0b3d91" },
        { name: "Black", value: "#111827" },
      ],
      description:
        "Modern Ethiopian dress for diaspora events and celebrations.",
      availability: "In Stock",
      stock: 3,
      rating: 4.9,
      reviews: 22,
      delivery: "Ships in 5–7 days",
    },
  ];