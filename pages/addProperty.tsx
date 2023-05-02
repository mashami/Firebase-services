import React, { useState, useRef } from 'react';
import { VStack, Input, Button, Checkbox, FormControl, FormLabel, FormHelperText, Textarea, Box } from '@chakra-ui/react';
import {
    collection,
    addDoc,
    Timestamp,
} from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '.././utils/firebase';


const AddProductFormWithImage = () => {
    const [formInput, setFormInput] = useState({
        title: '',
        description: '',
        availability: true,
        price: '',
        date: Timestamp.fromDate(new Date()),
        address: {
            province: 'Kigali',
            district: 'Nyarugenge',
        },
        contacts: {
            email: 'picture@email.com',
            phoneNumber: '078561452',
        },
        createdBy: '5',
       
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [downloadURLs, setDownloadURLs] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [progressUpload, setProgressUpload] = useState(0);

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsUploading(true);
        setProgressUpload(0);
        
        const colRef = collection(db, "Products")
        const docRef = await addDoc(colRef, formInput);
        console.log(formInput);
        
        if (imageFiles.length > 0) {
            const promises = imageFiles.map((file) => {
                const imageRef = ref(storage, `images/${docRef.id}/${file.name}`);
                
                // const imageRef = ref(storage, `images/${docRef.id}/`);
                const uploadTask = uploadBytesResumable(imageRef, file);
                 
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgressUpload(progress);
                });

                return new Promise<string>((resolve, reject) => {
                    uploadTask.then(async (snapshot) => {
                        const downloadURL = await getDownloadURL(snapshot.ref);
                        
                        resolve(downloadURL);
                    }).catch(reject);
                });
            });

            Promise.all(promises).then((downloadURLs) => {
                setDownloadURLs(downloadURLs);
                setIsUploading(false);
            }).catch((error) => {
                console.error(error);
                error('Failed to upload images.');
                setIsUploading(false);
            });
        }

        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) =>
        setFormInput((prev) => {
            const { name, value, type } = e.target;
            //   let newValue: string | boolean | Date | { province: string; district: string } | { email: string; phoneNumber: string };
            let newValue: string | boolean | Date | { province: string; district: string } | { email: string; phoneNumber: string } | number;

            if (type === 'checkbox') {
                newValue = (e.target as HTMLInputElement).checked;
            } else if (type === 'date') {
                newValue = new Date(value);
            } else if (name === 'price') {
                // newValue = parseInt(value);

                newValue = Number.parseInt(value);
            } else if (name === 'address' || name == 'address.province' || name == 'address.district') {

                const { province, district } = prev.address;
                newValue = {
                    province: name === 'address.province' ? value : province,
                    district: name === 'address.district' ? value : district,
                };

            } else if (name === 'contacts' || name ==='contacts.email' || name === 'contacts.phoneNumber') {
                const { email, phoneNumber } = prev.contacts;
                newValue = {
                    email: name === 'contacts.email' ? value : email,
                    phoneNumber: name === 'contacts.phoneNumber' ? value : phoneNumber,
                };
            } else {
                newValue = value;
            }
            return { ...prev, [name]: newValue };
        });
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setImageFiles((prev) => [...prev, ...Array.from(files)]);
        }
    };

    return (
        <Box bgColor="black">
            <form onSubmit={handleSubmit} ref={formRef}>
                <VStack spacing={4} align="stretch" bgColor="green">
                    <FormControl isRequired >
                        <FormLabel>Title</FormLabel>
                        <Input type="text" name="title" value={formInput.title} onChange={handleChange} bgColor="black"/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            name="description"
                            value={formInput.description}
                            onChange={handleChange}
                            placeholder="Describe your product here..."
                            bgColor="black"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Availability</FormLabel>
                        <Checkbox
                            name="availability"
                            isChecked={formInput.availability}
                            onChange={handleChange} 
                            bgColor="black"
                        >
                            Available
                        </Checkbox>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Price</FormLabel>
                        <Input type="number" name="price" value={formInput.price} onChange={handleChange} bgColor="black"/>
                    </FormControl>
                    
                    <FormControl isRequired>
                        <FormLabel>Province</FormLabel>
                        <Input
                            type="text"
                            name="province"
                            value={formInput.address.province}
                            onChange={handleChange}
                            bgColor="black"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>District</FormLabel>
                        <Input
                            type="text"
                            name="district"
                            value={formInput.address.district}
                            onChange={handleChange}
                            bgColor="black"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            name="email"
                            value={formInput.contacts.email}
                            onChange={handleChange}
                            bgColor="black"
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                            type="tel"
                            name="phoneNumber"
                            value={formInput.contacts.phoneNumber}
                            onChange={handleChange}
                            bgColor="black"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Images</FormLabel>
                        <Input type="file" multiple onChange={handleImageChange} bgColor="black" />
                    </FormControl>
                    <Button type="submit" colorScheme="teal" disabled={isUploading} bgColor="black">
                        {isUploading ? `Uploading ${progressUpload.toFixed(0)}%` : 'Submit'}
                    </Button>
                </VStack>
            </form>
        </Box>
    );

}

export default AddProductFormWithImage;