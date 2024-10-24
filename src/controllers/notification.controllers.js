import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import notificationServices from "../services/notification.services.js";
import { dataResponse, messageResponse } from "../utils/responses.js";

const notificationController = {
  async getUserNotifications(req, res, next){
        let userId = req.user;

        let notifications = notificationServices.getUserNotifications(userId)        

        return res.status(200).send(dataResponse("Notifications has been fetched successfully", {notifications}))
  },
  async addNotificationToken(req, res, next){
        let userId = req.user;

        let {notificationId} = req.body;

        await notificationServices.addNotificatoinToken(userId, notificationId);

        return res.status(200).send(messageResponse("Notification Token has been added successfully"));
  }
};

export default notificationController