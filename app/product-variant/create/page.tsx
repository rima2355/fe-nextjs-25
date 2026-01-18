'use client';

import Layout from '@/commponents/ui/Layout';
import { serviceStore, service } from '@/services/services';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { ProductCategoryType } from '@/services/data-types/product-category-type';
import { ProductType } from '@/services/data-types/product-type';

export default function ProductVariantCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<Record<string, boolean>>({});
    const [categories, setCategories] = useState<ProductCategoryType[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const [categoriesRes, productsRes] = await Promise.all([
                service('product-categories'),
                service('products')
            ]);
            if (!categoriesRes.error) {
                setCategories(categoriesRes.data);
            }
            if (!productsRes.error) {
                setProducts(productsRes.data);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setIsError((prevError) => ({ ...prevError, [name]: false }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const submitData = new FormData(e.currentTarget);

            const response = await serviceStore('product-variant', submitData);
            if (response.error) {
                if (response.message == 'Token has expired') {
                    Cookies.remove('token');
                    router.push('/');
                } else if (response.message) {
                    if (typeof response.message === 'object') {
                        Object.entries(response.message).forEach(([key, value]) => {
                            if (Array.isArray(value)) {
                                setIsError((prevError) => ({ ...prevError, [key]: true }));
                                toast.error(value[0]);
                            }
                        });
                    } else {
                        toast.error(response.message);
                    }
                }
            } else {
                toast.success('Product Variant created successfully');
                router.push('/product-variant');
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Something went wrong';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <h1 className="text-black text-2xl font-bold">Product Variant Create</h1>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <TextField
                        error={isError.name}
                        onChange={handleChange}
                        name="name"
                        id="name"
                        label="Variant Name"
                        variant="standard"
                    />
                    <FormControl variant="standard" error={isError.product_category_id}>
                        <InputLabel id="product_category_id-label">Category</InputLabel>
                        <Select
                            labelId="product_category_id-label"
                            id="product_category_id"
                            name="product_category_id"
                            label="Category"
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {isError.product_category_id && (
                            <FormHelperText>Category is required</FormHelperText>
                        )}
                    </FormControl>
                    <FormControl variant="standard" error={isError.product_id}>
                        <InputLabel id="product_id-label">Product</InputLabel>
                        <Select
                            labelId="product_id-label"
                            id="product_id"
                            name="product_id"
                            label="Product"
                        >
                            {products.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {isError.product_id && (
                            <FormHelperText>Product is required</FormHelperText>
                        )}
                    </FormControl>
                    <TextField
                        error={isError.price}
                        onChange={handleChange}
                        name="price"
                        id="price"
                        label="Price"
                        variant="standard"
                        type="number"
                    />
                    <TextField
                        error={isError.stock}
                        onChange={handleChange}
                        name="stock"
                        id="stock"
                        label="Stock"
                        variant="standard"
                        type="number"
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" variant="contained" loading={isLoading}>
                        Submit
                    </Button>
                </div>
            </form>
        </Layout>
    );
}
