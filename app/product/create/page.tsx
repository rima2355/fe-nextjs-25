'use client';

import Layout from '@/commponents/ui/Layout';
import { serviceStore, service } from '@/services/services';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { ProductCategoryType } from '@/services/data-types/product-category-type';

export default function ProductCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<Record<string, boolean>>({});
    const [categories, setCategories] = useState<ProductCategoryType[]>([]);

    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await service('product-categories');
            if (!response.error) {
                setCategories(response.data);
            }
        };
        fetchCategories();
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

            const response = await serviceStore('products', submitData);
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
                toast.success('Product created successfully');
                router.push('/product');
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
            <h1 className="text-black text-2xl font-bold">Product Create</h1>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <TextField
                        error={isError.name}
                        onChange={handleChange}
                        name="name"
                        id="name"
                        label="Name"
                        variant="standard"
                    />
                    <TextField
                        error={isError.code}
                        onChange={handleChange}
                        name="code"
                        id="code"
                        label="Code"
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
                    <TextField
                        error={isError.description}
                        onChange={handleChange}
                        name="description"
                        id="description"
                        label="Description"
                        variant="standard"
                        multiline
                        rows={2}
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
