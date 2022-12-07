import express from 'express';
import { createFood, deleteFood, updateVendorProfile, vendorLogin, VendorProfile, GetAllVendor , GetFoodByVendor} from '../controller/vendorController';
import { authVendor } from '../middleware/authorization';
import { upload } from '../utils/multer';

const router = express.Router();
router.get('/get-all-vendors' ,GetAllVendor);
router.get('/get-vendor-food/:id' ,GetFoodByVendor);
router.post('/login', vendorLogin);
router.post('/create-food', authVendor,upload.single('image'), createFood);
router.get('/get-profile' ,authVendor, VendorProfile);
router.delete('/delete-food/:foodid',authVendor, deleteFood)
router.patch('/update-profile', authVendor, upload.single('coverImage'), updateVendorProfile);
export default router ;