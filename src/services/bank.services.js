import createHttpError from "http-errors";
import User from "../models/user.model";
import BankAccount from "../models/bank.model";

const bankServices = {
    async addBankAccount(userId, bankAccountNumber, bankUserName, bankName){
        let user = await User.findById(userId);

        if(!user)
            throw createHttpError.NotFound("User not found");

        let bankAccount = await BankAccount.findOne({user: userId});

        if(bankAccount)
            throw createHttpError.Conflict("Bank account is already assigned");

        let newBankAccount = new BankAccount({user: userId, bankAccountNumber, bankUserName, bankName});

        await newBankAccount.save()

        return newBankAccount;
    },
    async getBankDetails(userId){
        let user = await User.findById(userId);

        if(!user)
            throw createHttpError.NotFound("User not found");

        let bankAccount = await BankAccount.findOne({user: userId});

        if(!bankAccount)
            throw createHttpError.Conflict("Bank account doesn't exist");

        return bankAccount;
    }
};

export default bankServices;