
import React, { useState, useRef } from 'react';
import { VStack, Input, Button, Checkbox, FormControl, FormLabel, FormHelperText, Textarea, Box } from '@chakra-ui/react';
import {
    collection,
    addDoc,
    Timestamp,
} from "firebase/firestore"
import { db } from '../utils/firebase';



const AddProductForm = () => {
    const [formInput, setFormInput] = useState({
        title: '',
        description: '',
        availability: true,
        price: '',
        date:Timestamp.fromDate( new Date()),
        address: {
            province: '',
            district: '',
        },
        contacts: {
            email: '',
            phoneNumber: '',
        },
        createdBy: '',
    });

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const colRef= collection(db, "Products")

        await addDoc(colRef, formInput)
        console.log(formInput);
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) =>
    setFormInput((prev) => {
      const { name, value, type } = e.target;
      let newValue: string | boolean | Date | { province: string; district: string } | { email: string; phoneNumber: string };
      if (type === 'checkbox') {
        newValue = (e.target as HTMLInputElement).checked;
      } else if (type === 'date') {
        newValue = new Date(value);
      } else if (name === 'address' || name === 'contacts') {
        newValue = { ...prev[name], [e.target.id]: value };
      } else {
        newValue = value;
      }
      return { ...prev, [name]: newValue };
    });
  

    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} bgColor="green">
            <form ref={formRef} onSubmit={handleSubmit}>
                <VStack spacing={5} alignItems="start">
                    <FormControl id="title" isRequired >
                        <FormLabel>Title</FormLabel>
                        <Input type="text" name="title" value={formInput.title} onChange={handleChange} bgColor="black"/>
                    </FormControl>
                    <FormControl id="description" isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea name="description" value={formInput.description} onChange={handleChange} bgColor="black" />
                    </FormControl>
                    <FormControl id="availability">
                        <Checkbox name="availability" isChecked={formInput.availability} onChange={handleChange} bgColor="black">
                            Available
                        </Checkbox>
                    </FormControl>
                    <FormControl id="price" isRequired>
                        <FormLabel>Price</FormLabel>
                        <Input type="text" name="price" value={formInput.price} onChange={handleChange} bgColor="black" />
                        <FormHelperText>Enter the price as a string, e.g. "$10"</FormHelperText>
                    </FormControl>
                    <FormControl id="address" isRequired>
                        <FormLabel>Address</FormLabel>
                        <Input type="text" id="province" name="address" placeholder="Province" value={formInput.address.province} onChange={handleChange} bgColor="black" />
                        <Input type="text" id="district" name="address" placeholder="District" value={formInput.address.district} onChange={handleChange} bgColor="black"/>
                    </FormControl>
                    <FormControl id="contacts" isRequired>
                        <FormLabel>Contacts</FormLabel>
                        <Input type="email" id="email" name="contacts" placeholder="Email" value={formInput.contacts.email} onChange={handleChange} bgColor="black" />
                        <Input type="text" id="phoneNumber" name="contacts" placeholder="Phone Number" value={formInput.contacts.phoneNumber} onChange={handleChange} bgColor="black"/>
                    </FormControl>
                    <FormControl id="createdBy" isRequired>
                        <FormLabel>Created By</FormLabel>
                        <Input type="text" name="createdBy" value={formInput.createdBy} onChange={handleChange} bgColor="black" />
                    </FormControl>
                    <Button type="submit" bgColor="black">Add Product</Button>
                </VStack>
            </form>
        </Box>
    );
};

export default AddProductForm;
