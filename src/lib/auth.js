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

    isDean(req, res, nex) {
        if(req.user.usuario_id == 1) {
            return next()
        } else {
            return res.redirect('/home')
        }
    },

    isProfessor(req, res, nex) {
        if(req.user.usuario_id == 2) {
            return next()
        } else {
            return res.redirect('/home')
        }
    },

    isStudent(req, res, next) {
        if(req.user.usuario_id == 3) {
            return next()
        } else {
            return res.redirect('/home')
        }
    }
};