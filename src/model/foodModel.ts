import {DataTypes, Model} from 'sequelize';
import {db} from '../config/index'

export interface FoodAttributes{
    id:string;
    name:string;
    description:string;
    category:string;
    foodType:string;
    readyTime:number;
    price:number;
    rating:number;
    vendorId:string;
    
}

export class FoodInstance extends Model<FoodAttributes>{}

FoodInstance.init({
    id:{
        type:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false
    },
    readyTime:{
        type:DataTypes.NUMBER,
        allowNull:true,
        
    },
   
    name:{
        type:DataTypes.STRING,
        allowNull:true,
    },

    description:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    category:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    price:{
        type:DataTypes.NUMBER,
        allowNull:false,
    },
  
    foodType:{
        type:DataTypes.STRING,
        allowNull:false,
    },
        
        rating:{
            type:DataTypes.NUMBER,
            allowNull:false,
        },
        vendorId:{
            type:DataTypes.UUIDV4,
            allowNull:false,
        }
    
},
{
    sequelize:db,
    tableName:'food'
});