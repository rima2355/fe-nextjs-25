import Layout from '@/commponents/ui/Layout'
import { Button, TextField } from '@mui/material'
import React from 'react'

export default function Page() {
  return (
    <Layout>
        <h1 className= "text-black text-2xl font-bold">Product Category Create</h1>
        <form action=""className="w-full">
            <div className="grid grid-cols-2 gap-4 my-4">
        <TextField name="name"
         id="name" 
         label="Name" 
         variant="standard"
         required
         />
        <TextField
        name="description"
         id="description"   
         label="Description" 
         variant="standard"
         required
         />
         </div> 
         <div className="flex justify-end">
          <Button type="submit" variant="contained" >
            Submit
          </Button>
        </div>
        </form>
    </Layout>
   
  )
}
