import { Request, Response } from 'express';
import { adminSchema, GenerateOTP, GeneratePassword, GenerateSalt, GenerateSignature, option, vendorSchema, } from '../utils';
import { UserAttributes, UserInstance } from '../model/userModel';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from 'jsonwebtoken';
import { VendorAttributes, VendorInstance } from '../model/vendorModel';

export const AdminRegister = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.user.id;
        const { email, phone, password, firstName, lastName, address, } = req.body;

        const uuidUser = uuidv4()

        const validateResult = adminSchema.validate(req.body, option);

        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }

        // Generate salt
        const salt = await GenerateSalt();
        const adminPassword = await GeneratePassword(password, salt);

        // Generate OTP
        const { otp, expiry } = GenerateOTP();


        //check if user exist
        const Admin = (await UserInstance.findOne({ where: { id: id } })) as unknown as UserAttributes;

        if (Admin.email === email) {
            return res.status(400).json({
                message: "Email already exist"
            })
        }
        if (Admin.phone === phone) {
            return res.status(400).json({
                message: "Phone number already exist"
            })
        }

        if (Admin.role === "superAdmin") {
            await UserInstance.create({
                id: uuidUser,
                email,
                password: adminPassword,
                firstName,
                lastName,
                salt,
                address,
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role: "admin",


            })
            //Check if the Amin exist
            const Admin = await UserInstance.findOne({ where: { id: id } }) as unknown as UserAttributes;


            // Generate a signature
            let signature = await GenerateSignature({
                id: Admin.id,
                email: Admin.email,
                verified: Admin.verified,
            });

            return res.status(201).json({
                message: "admin created successfully ",
                signature,
                verified: Admin.verified,

            })
        }

        return res.status(400).json({
            message: "Admin already exist",
        });



    } catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/signup"
        });
    }
};

export const SuperAdmin = async(req:JwtPayload, res:Response) =>{
        try{
            const { email, phone, password,firstName, lastName, address} = req.body;
            const uuiduser = uuidv4()
            const validateResult = adminSchema.validate(req.body, option)
            if(validateResult.error){
                return res.status(400).json({
                    Error:validateResult.error.details[0].message
                })
            }
        //Generate salt
        const salt = await GenerateSalt();
        const adminPassword = await GeneratePassword(password, salt)
        //Generate OTP
        const  {otp, expiry} = GenerateOTP();
        //Check if Admin exist
        const Admin = await UserInstance.findOne({where: {email:email}}) as unknown as UserAttributes;
        //Create Admin
        if(!Admin){
          await UserInstance.create({
            id:uuiduser,
            email,
            password: adminPassword,
            firstName,
            lastName,
            salt,
            address,
            phone,
            otp,
            otp_expiry: expiry,
            lng: 0,
            lat: 0,
            verified: true,
            role: "superadmin"
        })
        //check if admin exist
        const Admin = await UserInstance.findOne({where: {email:email}}) as unknown as UserAttributes
        //Generate a signature
        let signature = await GenerateSignature({
            id:Admin.id,
            email:Admin.email,
            verified: Admin.verified,
        });
            return res.status(201).json({
                message:"Admin created successfully",
                signature,
                 verified: Admin.verified,
            })
        }
        return res.status(400).json({
            message:"Admin already exist",
        })
        }catch(err){
            res.status(500).json({
                Error:"Internal server Error",
                route:"/admins/create-admin"
            })
        }
        }

        /**==================== Super-Admin ========================**/
    /**==================== RegisterAdmin ========================**/
    export const superAdmin = async(req:JwtPayload, res:Response) =>{
        try{
            const { email, phone, password,firstName, lastName, address} = req.body;
            const uuiduser = uuidv4()
            const validateResult = adminSchema.validate(req.body, option)
            if(validateResult.error){
                return res.status(400).json({
                    Error:validateResult.error.details[0].message
                })
            }
        //Generate salt
        const salt = await GenerateSalt();
        const adminPassword = await GeneratePassword(password, salt)
        //Generate OTP
        const  {otp, expiry} = GenerateOTP();
        //Check if Admin exist
        const Admin = await UserInstance.findOne({where: {email:email}}) as unknown as UserAttributes;
        //Create Admin
        if(!Admin){
          await UserInstance.create({
            id:uuiduser,
            email,
            password: adminPassword,
            firstName,
            lastName,
            salt,
            address,
            phone,
            otp,
            otp_expiry: expiry,
            lng: 0,
            lat: 0,
            verified: true,
            role: "superAdmin"
        })
        //check if admin exist
        const Admin = await UserInstance.findOne({where: {email:email}}) as unknown as UserAttributes
        //Generate a signature
        let signature = await GenerateSignature({
            id:Admin.id,
            email:Admin.email,
            verified: Admin.verified,
        });
            return res.status(201).json({
                message:"Admin created successfully",
                signature,
                 verified: Admin.verified,
            })
        }
        return res.status(400).json({
            message:"Admin already exist",
        })
        }catch(err){
            res.status(500).json({
                Error:"Internal server Error",
                route:"/admins/create-admin"
            })
        }
        };

         /**==================== create vendor========================**/

         export const createVendor = async(req: JwtPayload, res: Response)=>{
         try{
            const id = req.user.id;
            const { name, restaurantName,pincode,phone,address, email, password } = req.body;
            const uuidvendor= uuidv4()
            const validateResult = vendorSchema.validate(req.body, option)
            if(validateResult.error){
                return res.status(400).json({
                    Error:validateResult.error.details[0].message
                });
            }
            //Generate salt
        const salt = await GenerateSalt();

        const vendorPassword = await GeneratePassword(password, salt)
         //check if vendor exist
         const Vendor = await VendorInstance.findOne({where: {email:email}}) as unknown as VendorAttributes
         const Admin = await UserInstance.findOne({where: {id:id}}) as unknown as UserAttributes
         if(Admin.role ==='admin' || Admin.role === 'superAdmin'){
            if(!Vendor){
                const createVendor =await VendorInstance.create({
                    id : uuidvendor,
                    name,
                    pincode,
                    restaurantName,
                    email,
                    phone,
                    salt,
                    password:vendorPassword,
                    address,
                    role:"vendor",
                    serviceAvailable:false,
                    rating:0,
                    coverImage:''
                })
                return res.status(201).json({
                    message:"vendor created successfully",
                    createVendor
                });
            }
            return res.status(400).json({
                message:"vendor already exist",
            });
         }  
    return res.status(400).json({
        message:"unathorised",
    })
         } catch(err){
            res.status(500).json({
                Error:"Internal server Error",
                route:"/admins/create-vendors"
            })
         } 
         }