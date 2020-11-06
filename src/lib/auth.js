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

  isDeanUser(req, res, next) {
    if (req.user.rolId == 1) {
      return next();
    }
    return res.redirect('/home');
  },

  isProfessorUser(req, res, next) {
    if (req.user.rolId == 2) {
      return next();
    }
    return res.redirect('/home');
  },

  isStudentUser(req, res, next) {
    if (req.user.rolId == 3) {
      return next();
    }
    return res.redirect('/home');
  },

  isUserStudentOrProfessor(req, res, next) {
    if (req.user.rolId == 2 || req.user.rolId == 3) {
      return next();
    }
    return res.redirect('/home');
  }
};
