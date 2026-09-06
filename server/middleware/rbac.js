/**
 * Role-Based Access Control Middleware
 * Restricts route access to specified roles.
 * Usage: authorize('artisan', 'admin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Authentication is required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Your role (${req.user.role}) is not authorized to access this resource.`
      });
    }

    next();
  };
};

export default authorize;
