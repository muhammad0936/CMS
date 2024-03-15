import validator from 'validator';
import bcrypt from 'bcrypt';
// import models :
import User from '../../models/user.mjs';
import {Op} from 'sequelize'


export default {
    createUser: async({userInput}, req)=>{
        const {fname, lname, email, password, birthDate, userName} = userInput;
        // <VALIDATION> : 
        const validationErrors = [];
        if(!validator.isAlpha(fname)|| !validator.isAlpha(lname))
        {
            validationErrors.push({message: 'Use only alphabet characters for fname and lname!'});
        }
        if(!validator.isLength(lname, {min: 2, max:15}) || !validator.isLength(fname, {min: 2, max:15}))
        {
            validationErrors.push({message: 'lname and fname must be between 2 and 15 characters of length!'});
        }
        if(!validator.isEmail(email))
        {
            validationErrors.push({message: 'Use a valid email!'});
        }
        if(!validator.isLength(password, {min: 5, max: 30}))
        {
            validationErrors.push({message: 'Password length must be between 5 and 30!'});
        }
        if(!validator.isDate(birthDate)){
            validationErrors.push({message: 'Enter valid birth date!'});
        }
        if(!validator.isAlphanumeric(userName) || !validator.isLength(userName, {min: 4, max: 30}))
        {
            validationErrors.push({message: 'Use only alphabet characters and numbers, don\'t start with number, the length must be between 4 and 30.'});
        }
        if(validationErrors.length > 0)
        {
            const error = new Error('ivalid inputs!');
            error.data = validationErrors;
            error.status = 422;
            throw error;
        }
        // </VALIDATION>
        
        // <PREVENT REPEATED EMAILS AND USERNAMES> :
        const isExistsUser = await User.findOne({where: {email: email}});
        if(isExistsUser)
        {
            const error = new Error('This email is already exists!');
            error.status = 409;
            throw error;
        }
        const isUserNameExists = await User.findOne({where: {userName: userName}});
        if(isUserNameExists)
        {
            const error = new Error('This user name is already used!');
            error.status = 409;
            throw error;
        }
        //</PREVENT REPEATED EMAILS AND USERNAMES>
        userInput.password = await bcrypt.hash(password, 12);
        const user = await User.create(userInput);
        return {name: `${user.fname} ${user.lname}`, email: user.email, userName: user.userName, birthDate: user.birthDate}
    },
    login: async({userInput}, req)=>{
        const {email, password} = userInput;
        const validationErrors = [];
        if(!validator.isEmail(email)){
        validationErrors.push({message: 'Use valid email!'});
        }
        if(!validator.isLength(password, {min: 5, max: 30}))
        {
            validationErrors.push({message: 'Password length must be between 5 and 30!'});
        }
        if(validationErrors.length > 0)
        {
            const error = new Error('ivalid inputs!');
            error.data = validationErrors;
            error.status = 422;
            throw error;
        }
        const user = await User.findOne({where: {email: email}});
        if(!user)
        {
            const error = new Error('email not found!');
            error.status = 401;
            throw error;
        }
        const isPasswordCorrect =await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect)
        {
            const error = new Error('Wrong password!');
            error.status = 401;
            throw error;
        }
        req.session.isLoggedIn = true;
        req.session.user =  user;
        return user.dataValues;
        },
        
        updateBio: async({bio}, req)=>{
            if(!req.session.user)
            {
                const error = new Error('Not authorized!');
                error.status = 401;
                throw error;
            }
            const user = await User.findByPk(req.session.user._id);
            if(!user)
            {
                const error = new Error('Not authorized!');
                error.status = 401;
                throw error
            }
            const validationErrors = [];
            if(!validator.isLength(bio, {max: 100})){
                validationErrors.push({message: 'The bio must be with maximum length 100!'});
            }
            if(validationErrors.length > 0)
            {
                const error = new Error('Validation failed!');
                error.data = validationErrors;
                error.status = 422;
                throw error;
            }
            user.bio = bio;
            await user.save();
            return 'User bio updated';
        },
        findUserByName: async({name}, req)=> {
            if(!req.session.isLoggedIn || !req.session.user._id)
            {
                const error = new Error('Not authorized');
                error.status = 401;
                throw error;
            }
            const searchName = name.trim().replace(/\s+/g, ' ').toLowerCase();
            var users = await User.findAll({
                where: {
                        fname: {
                            [Op.like]: searchName.split(' ')[0]+ ' ' + searchName.split(' ')[1] || ''
                        }
                }});
            users = users.concat(await User.findAll({
                where: {
                        fname: {
                            [Op.like]: searchName.split(' ')[0]|| ''
                        },
                        _id: {
                            [Op.notIn]: users.map(u=>u._id)
                        }
            }}));
            users = users.concat(await User.findAll({
                where: {
                        lname: {
                            [Op.like]: searchName.split(' ')[1] + ' ' + searchName.split(' ')[2] || ''
                        },
                        _id: {
                            [Op.notIn]: users.map(u=>u._id)
                        }
            }}));
            users = users.concat(await User.findAll({
                where: {
                        lname: {
                            [Op.like]: searchName.split(' ')[1] || ''
                        },
                        _id: {
                            [Op.notIn]: users.map(u=>u._id)
                        }
            }}));
            return users
        },
        findUserByUserName: async({userName}, req) => {
            if(!req.session.isLoggedIn || !req.session.user._id)
            {
                const error = new Error('Not authorized');
                error.status = 401;
                throw error;
            }
            const user = await User.findOne({where: {
                userName: userName
            }});
            if(!user)
            {
                const error = new Error('User not found!');
                error.status = 404;
                throw error;
            }
            return user;
        },
        followUser : async({followedUserId}, req)=> {
                if(!req.session.isLoggedIn || !req.session.user._id)
                {
                    const error = new Error('Not authorized');
                    error.status = 401;
                    throw error;
                }
                if(followedUserId === req.session.user._id)
                {
                    const error = new Error('You can\'t follow yourself!');
                    error.status = 422;
                    throw error;
                }
                const user = await User.findByPk(req.session.user._id);
                if(!user)
                {
                    const error = new Error('Not authorized');
                    error.status = 401;
                    throw error;
                }
                if(!validator.isNumeric(`${followedUserId}`))
                {
                    const error = new Error('Invalid input!');
                    error.data = [{message : 'Followed user id must be an integer!'}];
                    error.status = 422;
                    throw error;
                }
                const followedUser = await User.findByPk(followedUserId);
                if(!followedUser)
                {
                    const error = new Error('We can\'t find the user you try to follow!');
                    error.status = 404;
                    throw error;
                }
        
                await user.addFollowed(followedUser);
            return 'You are now following the user with id '+ followedUserId;
        },
        
}