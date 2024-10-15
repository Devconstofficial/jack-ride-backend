import mongoose from "mongoose";
import PetOwner from "../models/petOwner.model.js"
import createError from "http-errors";

const petOwnerRepository = {
    async getSpecificPetOwner(id){
        const petOwnerId = new mongoose.Types.ObjectId(id);
        
        const pipeline = [
        {
            $match: {
            _id: petOwnerId
            }
        },
        {
            $lookup: {
            from: 'users',           
            localField: 'user',       
            foreignField: '_id',  
            as: 'user' 
            }
        },
        {
            $unwind: '$user'
        },
        {
            $replaceRoot: {
            newRoot: {
                $mergeObjects: ['$user', '$$ROOT']
            }
            }
        },
        {
            $project: {
            user: 0 
            }
        }
        ];
        
        let petOwners = await PetOwner.aggregate(pipeline);

        if(petOwners.length < 1)
            throw new createError.NotFound("Pet Owner doesn't exist");
        
        let petOwner = petOwners[0];
        
        return petOwner;
    }
}

export default petOwnerRepository;