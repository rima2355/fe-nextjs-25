'use client';

import Layout from '@/commponents/ui/Layout';
import { serviceShow, serviceUpdate, service } from '@/services/services';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { ProductCategoryType } from '@/services/data-types/product-category-type';
import { ProductType } from '@/services/data-types/product-type';

export default function ProductVariantEdit() {
    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isError, setIsError] = useState<Record<string, boolean>>({});
    const [categories, setCategories] = useState<ProductCategoryType[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [formValues, setFormValues] = useState({
        name: '',
        product_category_id: '',
        product_id: '',
        price: '',
        stock: '',
    });

    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

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

    const getProductVariant = useCallback(async () => {
        setFetching(true);
        const response = await serviceShow('product-variant', id);
        if (!response.error) {
            setFormValues({
                name: response.data.name || '',
                product_category_id: response.data.product_category_id || '',
                product_id: response.data.product_id || '',
                price: response.data.price || '',
                stock: response.data.stock || '',
            });
        } else {
            toast.error(response.message);
        }
        setFetching(false);
    }, [id]);

    useEffect(() => {
        getProductVariant();
    }, [getProductVariant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIsError((prevError) => ({ ...prevError, [name]: false }));
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setIsError((prevError) => ({ ...prevError, [name]: false }));
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const submitData = new FormData(e.currentTarget);

            const response = await serviceUpdate(
                'product-variant',
                submitData,
                id
            );
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
                toast.success('Product Variant updated successfully');
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

    if (fetching) {
        return (
            <Layout>
                <div className="flex justify-center h-96">
                    <p className="text-black text-md font-bold text-center">Loading...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <h1 className="text-black text-2xl font-bold">Product Variant Edit</h1>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <TextField
                        error={isError.name}
                        onChange={handleChange}
                        name="name"
                        id="name"
                        label="Variant Name"
                        variant="standard"
                        value={formValues.name}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                    <FormControl variant="standard" error={isError.product_category_id}>
                        <InputLabel id="product_category_id-label" shrink>Category</InputLabel>
                        <Select
                            labelId="product_category_id-label"
                            id="product_category_id"
                            name="product_category_id"
                            label="Category"
                            value={formValues.product_category_id}
                            onChange={handleSelectChange}
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
                        <InputLabel id="product_id-label" shrink>Product</InputLabel>
                        <Select
                            labelId="product_id-label"
                            id="product_id"
                            name="product_id"
                            label="Product"
                            value={formValues.product_id}
                            onChange={handleSelectChange}
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
                        value={formValues.price}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                    <TextField
                        error={isError.stock}
                        onChange={handleChange}
                        name="stock"
                        id="stock"
                        label="Stock"
                        variant="standard"
                        type="number"
                        value={formValues.stock}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
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
