"use client"
import React, { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { useStoreModal } from '@/hooks/use-store-modal'
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import toast from 'react-hot-toast';
import prismadb from '@/lib/prismadb';


const formSchema = z.object({
  name: z.string().min(1),
});

const StoreModal = () => {
    const storeModal = useStoreModal();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
      }
    });

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
      try {
        setLoading(true);
        const res = await axios.post('/api/stores', value);
        window.location.assign(`${res.data.id}`);
      } catch (error) {
        toast.error("something when wrong");
      }
      finally
      {
        setLoading(false);
      }
    }

  return (
    <Modal
        title='Create Store'
        description='Add a new store to manga products and categories'
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
    >
      <div>
        <div className='space-y-4 py-2 pb-4'>
          <Form
            {...form}
          >
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder='E-commerce site' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                <Button disabled={loading} type='button' variant="outline" onClick={storeModal.onClose}>Cancel</Button>
                <Button disabled={loading} type='submit'>Continue</Button>

              </div>

            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}

export default StoreModal