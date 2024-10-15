import petOwnerRepository from "../repositories/petOwner.repositories.js";

const petOwnerServices = {
    async getSpecificPetOwner(id){
        let petOwner = await petOwnerRepository.getSpecificPetOwner(id);

        return {petOwner}
    }
}

export default petOwnerServices;