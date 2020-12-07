// Metodos usados para proteger rutas

module.exports = {
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/signin');
  },

  isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/home');
  },

  // Proteccion de rutas por rol de usuario
  isDeanUser(req, res, next) {
    let isDean = false;
    for (rol of req.user.roles) {
      if (rol.rolId == 1) {
        isDean = true;
      }
    }

    if (isDean) {
      return next();
    } else {
      return res.redirect('/home');
    }
  },

  isProfessorUser(req, res, next) {
    let isProfessor = false;
    for (rol of req.user.roles) {
      if (rol.rolId == 2) {
        isProfessor = true;
      }
    }

    if (isProfessor) {
      return next();
    } else {
      return res.redirect('/home');
    }
  },

  isStudentUser(req, res, next) {
    let isStudent = false;
    for (rol of req.user.roles) {
      if (rol.rolId == 3) {
        isStudent = true;
      }
    }

    if (isStudent) {
      return next();
    } else {
      return res.redirect('/home');
    }
  },

  isUserStudentOrProfessor(req, res, next) {
    let isStudentOrProfessor = false;
    for (rol of req.user.roles) {
      if (rol.rolId == 2 || rol.rolId == 3) {
        isStudentOrProfessor = true;
      }
    }

    if (isStudentOrProfessor) {
      return next();
    } else {
      return res.redirect('/home');
    }
  },

  isAdminUser(req, res, next) {
    let isAdminUser = false;

    for (rol of req.user.roles) {
      if (rol.rolId === 4) {
        isAdminUser = true;
      }
    }

    if (isAdminUser) {
      return next();
    } else {
      return res.redirect('/home');
    }
  }
};
