"use client"
import Layout from "@/commponents/ui/Layout";
import { service } from "@/services/services";
import React, { useEffect, useState } from "react";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Button } from "@mui/material";
import Link from "next/link";



const rows: GridRowsProp = [
  { id: 1, name: 'Data Grid', description: 'the Community version' },
  { id: 2, name: 'Data Grid Pro', description: 'the Pro version' },
  { id: 3, name: 'Data Grid Premium', description: 'the Premium version' },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Product Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 300 },
];


export default function Page(){
  const [rows, setRows]= useState <any>([]);

  const gettData = async () => {
  const response = await service('product-categories');
  if (!response.error) {
    setRows(response.data);
  }
    console.log(response);
};

useEffect(() => {
  gettData();
}, []);

  return (
    <Layout>
      <div className="flex w-full justify-between items-center my-4">
        <div className="flex items-center gap-2">
          <h1 className="text-black text-2xl font-bold"> Product Category</h1>
        </div>
          <div className="flex items-center gap-2">
            <Link href="/product-category/create">
          <Button variant="contained">Add New</Button>
          </Link>
          </div>
        </div>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid  rows={rows} columns={columns} />
        </div>
      
    </Layout>
  );
}
