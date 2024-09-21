import { check } from 'express-validator';

export const userRegisterValidation = [
  check('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long.'),
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address.'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.')
    .matches(/[@$!%*?&#]/)
    .withMessage('Password must contain at least one special character.'),
];
