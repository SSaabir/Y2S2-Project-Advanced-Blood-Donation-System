import Donor from '../models/donor.model.js'
import { errorHandler } from '../utils/error.js';
import createToken from '../utils/token.js';
import Hospital from '../models/hospital.model.js';
import Manager from '../models/SystemManager.model.js';
import HospitalAdmin from '../models/HospitalAdmin.model.js';


export const signinHD = async(req, res, next) => {
    const { email, password, userId } = req.body;
    console.log(userId);

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All Fields are Required'));
    }

    try {
        let user, role, name;
        user = await HospitalAdmin.signin(email, password, userId);
        console.log('Email is valid for hospital admin domain');
        //name = user.firstName +' '+ user.lastName;
        role = 'HospitalAdmin';

        const token = createToken(user._id);
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ token, userObj, role });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};



export const signinD = async(req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All Fields are Required'));
    }

    try {
        let user, role, name;
        user = await Donor.signin(email, password);
        console.log('Email is valid for donor domain');
        //name = user.firstName +' '+ user.lastName;
        role = 'Donor';

        const token = createToken(user._id);
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ token, userObj, role });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

export const signinH = async(req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All Fields are Required'));
    }

    try {
        let user, role, name;
        user = await Hospital.signin(email, password);
        console.log('Email is valid for hospital domain');
        
        role = 'Hospital';

        const token = createToken(user._id);
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ token, userObj, role });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};


export const signinA = async (req, res, next) => {
    const {email, password} = req.body;
 
    if (!email || !password || email === '' || password === '') {
       next(errorHandler(400, 'All Fields are Required'));
    }
 
    try {
     let user, role, name;
       user = await Manager.signin(email, password);
       console.log('Email is valid for manager domain');
        //name = user.firstName +' '+ user.lastName;
       role = 'Manager';
       const token = createToken(user._id);
       const userObj = user.toObject();
       delete userObj.password;

       res.status(200).json({ token, userObj, role });
    } catch (error) {
     res.status(400).json({error: error.message})
  }
 };


