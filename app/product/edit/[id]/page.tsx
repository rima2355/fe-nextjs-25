'use client';

import Layout from '@/commponents/ui/Layout';
import { serviceShow, serviceUpdate, service } from '@/services/services';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { ProductCategoryType } from '@/services/data-types/product-category-type';

export default function ProductEdit() {
    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isError, setIsError] = useState<Record<string, boolean>>({});
    const [categories, setCategories] = useState<ProductCategoryType[]>([]);
    const [formValues, setFormValues] = useState({
        name: '',
        code: '',
        product_category_id: '',
        description: '',
    });

    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await service('product-categories');
            if (!response.error) {
                setCategories(response.data);
            }
        };
        fetchCategories();
    }, []);

    const getProduct = useCallback(async () => {
        setFetching(true);
        const response = await serviceShow('products', id);
        if (!response.error) {
            setFormValues({
                name: response.data.name,
                code: response.data.code,
                product_category_id: response.data.product_category_id || '',
                description: response.data.description || '',
            });
        } else {
            toast.error(response.message);
        }
        setFetching(false);
    }, [id]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);

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
                'products',
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
                toast.success('Product updated successfully');
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
            <h1 className="text-black text-2xl font-bold">Product Edit</h1>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <TextField
                        error={isError.name}
                        onChange={handleChange}
                        name="name"
                        id="name"
                        label="Name"
                        variant="standard"
                        value={formValues.name}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                    <TextField
                        error={isError.code}
                        onChange={handleChange}
                        name="code"
                        id="code"
                        label="Code"
                        variant="standard"
                        value={formValues.code}
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
                    <TextField
                        error={isError.description}
                        onChange={handleChange}
                        name="description"
                        id="description"
                        label="Description"
                        variant="standard"
                        value={formValues.description}
                        multiline
                        rows={2}
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
