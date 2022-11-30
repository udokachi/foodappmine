import { Request, Response } from 'express';
import {  GenerateSignature, loginSchema, option, updateVendorSchema, validatePassword, } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from 'jsonwebtoken';
import { VendorAttributes, VendorInstance } from '../model/vendorModel';
import { FoodAttributes, FoodInstance } from '../model/foodModel';

 /**==================== login vendor ========================**/
export const vendorLogin = async(req:Request, res:Response)=>{
    try{

        const{ email, password}= req.body;
    
        const validateResult = loginSchema.validate(req.body, option);
    
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            });
        } 
        // check if vendor exist

        const Vendor = await VendorInstance.findOne({where:{email:email}}) as unknown as VendorAttributes; 

        if (Vendor){
          const validation =  await validatePassword(password, Vendor.password, Vendor.salt);
           // bycrpt.compare(password, Vendor.password)

          if(validation){
             // Regenerate signature for vendor
        let signature = await GenerateSignature({
            id: Vendor.id,
            email: Vendor.email,
            serviceAvailable: Vendor.serviceAvailable,
            
        });
        return res.status(200).json({
            message: "you have successfully logged in",
            signature,
            email: Vendor.email,
            serviceAvailable: Vendor.serviceAvailable,
            role: Vendor.role
        });
        

          }
        }
        return res.status(400).json({
            Error: "You are not a verified vendor"
        })

        
    }catch(err){
        res.status(500).json({
            Error:"Internal server Error",
            route:"/Vendors/login"
        })

     } 
     }

      /**==================== vendor add food========================**/
      export const createFood = async (req:JwtPayload, res:Response)=>{
        try{
             const id = req.vendor.id;
            //  console.log(id)
            const{
                name, description, category, foodType, readyTime, price, image}= req.body;
                const Vendor = await VendorInstance.findOne({where:{id:id}}) as unknown as VendorAttributes;
                const foodid = uuidv4()
                if(Vendor){
                    const createfood =await FoodInstance.create({
                        id:foodid,
                        name,
                        description, 
                        category,
                        foodType,
                        readyTime, 
                        price,
                        rating:0,
                        image: req.file.path,
                        vendorId:id
                    }) as unknown as FoodAttributes;
                    return res.status(201).json({
                        message:"food added successfully",
                        createfood
                    });
                }
                return res.status(400).json({
                    message:"unauthorised",
                });
             
                

        }catch(err){
            console.log(err)
        res.status(500).json({
            Error:"Internal server Error",
            route:"/vendors/create-food"
        })

     } 
    }

      /**==================== get vendor profile========================**/

      export const VendorProfile = async (req:JwtPayload, res:Response)=>{
        try{
                const id =req.vendor.id;
                 // check if vendor exist

        const Vendor = (await VendorInstance.findOne({
            where:{id:id},
            attributes:["id", "email", "name", "ownerName", "address", "phone",  "serviceAvailable", "rating", "role"],
            include:[
                {
                    model:FoodInstance,
                    as:'food',
                    attributes:["id", "name", "description", "category", "foodType", "readyTime", "price", "rating","vendorId"]
                },
            ]
        })) as unknown as VendorAttributes; 
        return res.status(200).json({
            Vendor
        })


        }catch(err){
        res.status(500).json({
            Error:"Internal server Error",
            route:"/vendors/get-profile"
        })

      } 
      }

       /**==================== vendor delete food========================**/
       export const deleteFood = async (req:JwtPayload, res:Response)=>{
        try{
            const id = req.vendor.id;
            const foodid = req.params.foodid;

            const Vendor = await VendorInstance.findOne({
                where:{id:id}
            }) as unknown as VendorAttributes;

            if(Vendor){
               
            const deletedFood = await FoodInstance.destroy({where:{id:foodid}});

            return res.status(200).json({
                message:"you have successfully deleted food",
                deletedFood,
            });
            }

            

        }catch(err){
        res.status(500).json({
            Error:"Internal server Error",
            route:"/vendors/get-profile"
        })

      } 
      }
    /************************************** updated Vendor **************************************/
      export const updateVendorProfile = async(req:JwtPayload, res:Response)=>{
        try{
            const id = req.vendor.id
            const {name,  address, phone, coverImage }= req.body;
            //joi validation
            const validateResult = updateVendorSchema.validate(req.body, option);
            if(validateResult.error){
                return res.status(400).json({
                    Error:validateResult.error.details[0].message,
                });
            }
          //check if Vendor is a registered Vendor
          const Vendor = (await VendorInstance.findOne({where: {id:id}})) as unknown as VendorAttributes; 
            if(!Vendor){
                return res.status(400).json({
                Error: "You are not authorized to update your profile"
            });
        }
        const updatedVendor = (await VendorInstance.update(
            {
                name,
                address,
                phone,
                coverImage:req.file.path
        },
       { where: { id: id },})) as unknown as VendorAttributes;
       if(updatedVendor){
        const Vendor = (await VendorInstance.findOne({where: {id:id}})) as unknown as VendorAttributes; 
       return res.status(200).json({
        message: "You have successfully updated your profile",
        Vendor,
    })
       }
    return res.status(400).json({
        message:"Error occured"
    });
        }catch(err){
            res.status(500).json({
                Error:"Internal server Error",
                route: "/vendors/update-profile",
            });   
        }
    };
     
       