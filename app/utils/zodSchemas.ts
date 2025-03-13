import {z} from 'zod';

export const companyScema = z.object({
    name: z.string().min(2, 'Comapny name must be atleast 2 characters long'),
    location: z.string().min(1, 'Location must be defined'),
    about: z.string().min(10, 'Please provide some information about yout company'),
    logo: z.string().min(1, 'Please upload a logo'),
    website: z.string().url('Please provide a valid url'),
    LinkedinAccount: z.string().optional(),
})

export const userSchema = z.object({
    name: z.string().min(2, 'Name must be atleast 2 characters long.'),
    bio: z.string().min(10, 'Please provide some information about yourself.'),
    resume: z.string().min(1, 'Please upload a resume.'),
})

export const jobSchema = z.object({
    jobTitle: z.string().min(8, "Job title must be atleast 8 characters long"),
    employmentType: z.string().min(1, "Please select an employment type"),
    location: z.string().min(1, "Please select location"),
    salaryFrom: z.number().min(1, "Salary-from is required"),
    salaryTo: z.number().min(1, "Salary-to is required"),
    jobDescription: z.string().min(20, "Job description is required"),
    listingDuration: z.number().min(1, "Listing duration is required"),
    benefits: z.array(z.string()).min(1, "Please select atleast one benefit"),
    companyName: z.string().min(1, "Company name is required"),
    companyLocation: z.string().min(1, "Company Location is required"),
    companyAbout: z.string().min(10, "Company description is required"),
    companyLogo: z.string().min(1, "Company logo is required"),
    companyWebsite: z.string().min(1, "Company website is required"),
    companyLinkedinAccount: z.string().optional(),
})