import React, { useState } from 'react';
import { 
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} from 'state/api';
import { 
    Box,
    Card,
    CardActions,
    CardContent,
    Collapse,
    Button,
    Typography,
    Rating,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton
} from '@mui/material';
import { EditOutlined, DeleteOutlined, AddOutlined } from '@mui/icons-material';
import Header from 'components/Header';
import Loader from 'loader/Loader';

const Product = ({
    _id,
    name,
    description,
    price,
    rating,
    category,
    supply,
    stat,
    onEdit,
    onDelete
}) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card
            sx={{
                backgroundImage: "none",
                backgroundColor: theme.palette.background.alt,
                borderRadius: "0.55rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}    
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: "14px", color: theme.palette.secondary[700] }} gutterBottom>
                        {category}
                    </Typography>
                    <Box>
                        <IconButton size="small" onClick={() => onEdit({ _id, name, description, price, rating, category, supply })} sx={{ color: theme.palette.secondary[200], mr: "4px" }}>
                            <EditOutlined fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDelete(_id)} sx={{ color: theme.palette.neutral[300] }}>
                            <DeleteOutlined fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
                <Typography variant="h5" component="div" fontWeight="bold">{name}</Typography>
                <Typography sx={{ mb: "1.5rem", color: theme.palette.secondary[400] }} >
                    ${Number(price).toFixed(2)}
                </Typography>
                <Rating value={rating} readOnly precision={0.5} />
                <Typography variant="body2" mt="0.5rem">{description}</Typography>
            </CardContent>
            <Box>
                <CardActions>
                    <Button variant="primary" size="small"
                        onClick={() => setIsExpanded(!isExpanded)}>
                            See More
                    </Button>
                </CardActions>
                <Collapse
                    in={isExpanded}
                    timeout="auto"
                    unmountOnExit
                    sx={{ 
                        color: theme.palette.neutral[300]
                     }}
                >
                    <CardContent sx={{ pt: 0 }}>
                        <Typography variant="body2">id: {_id}</Typography>
                        <Typography variant="body2">Supply Left: {supply}</Typography>
                        {stat && (
                            <>
                                <Typography variant="body2">Yearly Sales This Year: {stat.yearlySalesTotal || 0}</Typography>
                                <Typography variant="body2">Yearly Units Sold This Year: {stat.yearlyTotalSoldUnits || 0}</Typography>
                            </>
                        )}
                    </CardContent>
                </Collapse>
            </Box>
        </Card>
    );
};

const Products = () => {
    const theme = useTheme();
    const { data, isLoading, error } = useGetProductsQuery();
    
    // Mutations
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    // Viewport states for responsive grids
    const isNonMobile = useMediaQuery("(min-width:1000px)");
    const isNonTablet = useMediaQuery("(min-width:600px)");

    // Dialog state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formProduct, setFormProduct] = useState(null); // null means "Add Product", object means "Edit Product"
    const [formState, setFormState] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        rating: '',
        supply: ''
    });

    const handleOpenForm = (product = null) => {
        if (product) {
            setFormProduct(product);
            setFormState({
                name: product.name,
                category: product.category,
                price: product.price,
                description: product.description,
                rating: product.rating,
                supply: product.supply
            });
        } else {
            setFormProduct(null);
            setFormState({
                name: '',
                category: '',
                price: '',
                description: '',
                rating: '0',
                supply: ''
            });
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setFormProduct(null);
    };

    const handleFormChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formProduct) {
                // UPDATE
                await updateProduct({
                    id: formProduct._id,
                    ...formState
                }).unwrap();
            } else {
                // CREATE
                await createProduct(formState).unwrap();
            }
            handleCloseForm();
        } catch (err) {
            console.error("Failed to save product:", err);
            alert("Error saving product: " + (err.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id).unwrap();
            } catch (err) {
                console.error("Failed to delete product:", err);
                alert("Error deleting product");
            }
        }
    };

    return (
        <Box m="1.5rem 2.5rem">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title='PRODUCTS' subtitle='List of all products'/>
                <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    onClick={() => handleOpenForm(null)}
                    sx={{
                        backgroundColor: theme.palette.secondary[400],
                        color: theme.palette.background.alt,
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        "&:hover": {
                            backgroundColor: theme.palette.secondary[300],
                            color: theme.palette.background.default
                        }
                    }}
                >
                    Add Product
                </Button>
            </Box>

            {
                data || !isLoading ? (
                    <Box
                        mt="20px" 
                        display="grid"
                        gridTemplateColumns= "repeat(4, minmax(0, 1fr))"
                        justifyContent="space-between"
                        rowGap="20px"
                        columnGap="1.33%"
                        sx = {{ 
                            "& > div": {
                                gridColumn: isNonMobile ? undefined : isNonTablet ? "span 2" : "span 4"
                            }
                         }}
                     >
                        {data.map(({
                            _id,
                            name,
                            description,
                            price,
                            rating,
                            category,
                            supply,
                            stat
                        }) => (
                            <Product
                                key={_id}
                                _id={_id}
                                name={name}
                                description={description}
                                price={price}
                                rating={rating}
                                category={category}
                                supply={supply}
                                stat={stat ? stat[0] : null}
                                onEdit={handleOpenForm}
                                onDelete={handleDelete}
                            />
                        ))}
                    </Box>
                ) : error ? (
                    <Typography color="error">Something went wrong fetching products</Typography>
                ) : (
                    <section>
                        <Loader/> 
                    </section>
                )
            }

            {/* CREATE / EDIT PRODUCT DIALOG DIAL */}
            <Dialog open={isFormOpen} onClose={handleCloseForm} fullWidth maxWidth="sm">
                <form onSubmit={handleFormSubmit}>
                    <DialogTitle sx={{ fontWeight: "bold", color: theme.palette.secondary.main }}>
                        {formProduct ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box display="flex" flexDirection="column" gap="1.5rem" mt="0.5rem">
                            <TextField
                                label="Product Name *"
                                name="name"
                                value={formState.name}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                            <TextField
                                label="Category *"
                                name="category"
                                value={formState.category}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                            <TextField
                                label="Price ($) *"
                                name="price"
                                type="number"
                                inputProps={{ step: "0.01", min: "0" }}
                                value={formState.price}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                            <TextField
                                label="Rating (0 - 5)"
                                name="rating"
                                type="number"
                                inputProps={{ min: "0", max: "5", step: "0.5" }}
                                value={formState.rating}
                                onChange={handleFormChange}
                                fullWidth
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                            <TextField
                                label="Supply Quantity"
                                name="supply"
                                type="number"
                                inputProps={{ min: "0" }}
                                value={formState.supply}
                                onChange={handleFormChange}
                                fullWidth
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={formState.description}
                                onChange={handleFormChange}
                                multiline
                                rows={3}
                                fullWidth
                                sx={{ '& label.Mui-focused': { color: theme.palette.secondary[300] }, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.secondary[300] } } }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: "1.5rem" }}>
                        <Button onClick={handleCloseForm} sx={{ color: theme.palette.neutral[300] }}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained"
                            sx={{
                                backgroundColor: theme.palette.secondary[400],
                                color: theme.palette.background.alt,
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: theme.palette.secondary[300],
                                    color: theme.palette.background.default
                                }
                            }}
                        >
                            Save Product
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Products;