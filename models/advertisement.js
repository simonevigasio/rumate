/*  
    tools imported for the declaration of the advertisement schema
    moment -> used to create Date object (YYYY MM DD)
    mongoose -> connection with MongoDB 
    Joi -> data validator for the schema
*/
const moment = require('moment');
const mongoose = require('mongoose');
const Joi = require("joi")
            .extend(require('@joi/date'));
Joi.objectId = require('joi-objectid')(Joi)

// Declaration of the schema and all its fields
const advertisementSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        required: true,
        minlength: 5,
        maxlength: 100,
        type: String
    },
    description: {
        required: true,
        maxlength: 500,
        type: String
    },
    price: {
        required: true,
        min: [0, 'Price can not be negative'],
        type: Number
    },
    room: {
        required: true,
        type: String,
        enum:['Single', 'Double', 'Triple']
    },
    flat_sex: {
        required: true,
        type: String,
        enum:['Male', 'Female', 'Mixed']
    },
    residence_zone: {
        required: true,
        type: String,
        enum: ['Povo','Bondone','Sardagna','Centro_storico_Piedicastello','Meano','Argentario','San_Giuseppe_Santa_Chiara','Oltrefersina','Villazzano','Mattarello','Ravina_romagnano','Oltrecastello']
    },
    expiry_date: {
        required: true,
        min: moment().format("YYYY MM DD"),
        max: moment().add(6, "M").format("YYYY MM DD"),
        type: Date
    },
    roommate: {
        required: true,
        min: [0, 'Roommate number must be positive'],
        type: Number
    }
});

// The model is saved on mongoose and could now be used in the code
const Advertisement = mongoose.model('Advertisement', advertisementSchema);

// Validation function for an advertisement object, before inserting it in the Database
function validateAdvertisement(advertisement) {
    const now = moment().format("YYYY MM DD");
    const limit = moment().add(6, "M").format("YYYY MM DD");

    const schema = Joi.object({
        user_id: Joi.objectId().required(),
        title: Joi.string().min(5).max(100).required(),
        description: Joi.string().max(500).required(),
        price: Joi.string().min(0).required(),
        room: Joi.string().valid('Single', 'Double', 'Triple').required(),
        flat_sex: Joi.string().valid('Male', 'Female', 'Mixed').required(),
        residence_zone: Joi.string().valid('Povo','Bondone','Sardagna','Centro_storico_Piedicastello','Meano','Argentario','San_Giuseppe_Santa_Chiara','Oltrefersina','Villazzano','Mattarello','Ravina_romagnano','Oltrecastello').required(),
        expiry_date: Joi.date().min(now).max(limit).format("YYYY MM DD"),
        roommate: Joi.number().min(0).required() 
    });

    return schema.validate(advertisement);
}

// Exporting the model Advertisement and the function validateAdvertisement to allow modules which include this module to use them
exports.Advertisement = Advertisement
exports.validate = validateAdvertisement