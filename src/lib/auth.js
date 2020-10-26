// Metodos usados para proteger rutas 

module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.redirect('/signin');            
        }
    },
    
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next() 
        } else {
            return res.redirect('/home');        
        }
    },

    isDeanUser(req, res, next) {
        console.log("usuario: ", req.user);
        if(req.user.role_id == 1) {
            return next()
        } else {
            return res.redirect('/home')
        }
    },

    isProfessorUser(req, res, next) {
        console.log("usuario: ", req.user);
        if(req.user.rol_id == 2) {
            return next()
        } else {
            return res.redirect('/home')
        }
    },

    isStudentUser(req, res, next) {
        if(req.user.rol_id == 3) {
            return next()
        } else {
            return res.redirect('/home')
        }
    },

    isUserStudentOrProfessor(req, res, next) {
        if(req.user.rol_id == 2 || req.user.rol_id == 3){
            return next()
        } else {
            return res.redirect('/home')
        }
    }
};