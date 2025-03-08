import {z} from 'zod';

export const companyScema = z.object({
    name: z.string().min(2, 'Comapny name must be at least 2 characters long'),
    location: z.string().min(1, 'Location must be defined'),
    about: z.string().min(10, 'Please provide some information about yout company'),
    logo: z.string().min(1, 'Please upload a logo'),
    website: z.string().url('Please provide a valid url'),
    LinkedinAccount: z.string().optional(),
})