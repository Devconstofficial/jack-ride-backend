
import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { messenger } from "../configs/firebase.config.js";
import { getUserNotifications } from "../repositories/notification.repository.js";
import createHttpError from "http-errors";

function getMessageBody(notificationId, image, title, body, data){
    return {
        data: data,
        notification: {
            image,
            title,
            body
        },
        token: notificationId
    };
}

let notificationServices = {
    async sendFirebaseNotificationByUserId(userId, title, body, data, image){
        let user = await User.findById(userId);
        let notificationPromises = [];
        let notificationIdsWithErrors = [];
        
        for(let i = 0; i<user.notificationIds.length; i++){
            let message = getMessageBody(user.notificationIds[i], image, title, body, data)
            notificationPromises.push(messenger.send(message).then(
                (result)=>{
                    
                }
            ).catch(
                (error)=>{
                    notificationIdsWithErrors.push(user.notificationIds[i])
                }
            ))
        }
        //
        await Promise.allSettled(notificationPromises);

        user.notificationIds = 
        user.notificationIds.filter((nId)=> 
            {return notificationIdsWithErrors.findIndex((ne) => ne==nId)==-1}
        );

        await user.save();

        let status = {
            "successfulNotificationsSent": notificationPromises.length - notificationIdsWithErrors.length,
            "failedNotificationsSent": notificationIdsWithErrors.length,
            "totalNotifcations": notificationPromises.length
        }
        
        return status
    },
    async sendNotification({title, body, imageUrl, data, recipient}){
        try{
            let notification = new Notification({title, body, imageUrl, data, recipient});
            
            await notification.save();
            
            await this.sendFirebaseNotificationByUserId(recipient, title, body, data, imageUrl);
        }
        catch(err){
            console.log(err);
        }
    },
    async addNotificatoinToken(userId, notificationId){
        let user = await User.findById(userId);

        if(!user)
            throw createHttpError.NotFound("User not found");

        //check if there is a user with already same notificationId
        let checkUser = await User.findOne({notificationIds: notificationId});

        if(checkUser && checkUser._id.toString() != user._id.toString()){
            checkUser.notificationIds = checkUser.notificationIds.filter(
                (nId) => nId != notificationId
            )
            await checkUser.save();
        }

        else if(checkUser && checkUser._id.toString() == user._id.toString())
            throw createHttpError.Conflict("Notificaiton Id is already attached to current user");

        user.notificationIds.push(notificationId);

        await user.save();
    },
    async getUserNotifications(userId){
        let notifications = await getUserNotifications(userId);

        return notifications;
    }
}

export default notificationServices;