const superAdminOnly = (req, res, next) => {
   console.log("role check:", req.user.role);
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Super admin access only",
    });
  }
  next();
};

export default superAdminOnly;