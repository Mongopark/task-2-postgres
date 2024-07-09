import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authorization.js';
import { jwtTokens } from '../utils/jwt-helpers.js';
import { body, validationResult } from 'express-validator';


const router = express.Router();


/* GET user by id. */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user details
    const userResult = await pool.query('SELECT * FROM users WHERE userId = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResult.rows[0];

    // Fetch organisations the user belongs to or created
    const organisationsResult = await pool.query(
      `SELECT DISTINCT o.* FROM organisations o
       LEFT JOIN user_organisations uo ON o.orgid = uo.orgid
       WHERE uo.userid = $1 OR o.createdBy = $1`, [id]
    );

    const organisations = organisationsResult.rows;

    // Respond with user details and organisations
    res.json({ 
      status: "success",
      message: "User record retrieved successfully",
      data: 
      {
        userId: user.userid,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
        phone: user.phone
      }, 
      // organisations
     });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Create a User
router.post(
  '/',
  [
    body('firstName').not().isEmpty().withMessage('First name is required'),
    body('lastName').not().isEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').isMobilePhone().withMessage('Phone number is invalid'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ 
          errors: 
          // errors.array()
          errors.array().map(val=>{
          return {
            field: val.path,
            message: val.msg
          }
        })
      });
      }

      const { firstName, lastName, email, password, phone } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        'INSERT INTO users (firstName, lastName, email, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [firstName, lastName, email, hashedPassword, phone]
      );

      const userId = newUser.rows[0].userid;

      const orgName = `${firstName}'s Organisation`;
      const newOrg = await pool.query(
        'INSERT INTO organisations (name, description) VALUES ($1, $2) RETURNING *',
        [orgName, 'Default organisation description']
      );

      const orgId = newOrg.rows[0].orgid;
      await pool.query(
        'INSERT INTO user_organisations (userId, orgId) VALUES ($1, $2)',
        [userId, orgId]
      );

      res.status(201).json(
        // jwtTokens(newUser.rows[0])
        {
          status: "success",
          message: "Registration Successful",
          data: {
            accessToken: jwtTokens(newUser.rows[0]).accessToken,
            user: { userId, firstName, lastName, email, phone
            }
          }
        }
      );
    } catch (error) {
      res.status(400).json({ 
        status: "Bad request",
        message: error.message,
        // message: "Registration Unsuccessful",
        statusCode: 400
      });
    }
  }
);


router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM users');
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;