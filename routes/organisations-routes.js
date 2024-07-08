import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';
import { body, validationResult } from 'express-validator'; // Add this line

const router = express.Router();

/* GET all organisations the user belongs to or created */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userid } = req.user;

    const userOrgs = await pool.query(
      `SELECT DISTINCT o.* FROM organisations o
       LEFT JOIN user_organisations uo ON o.orgid = uo.orgid
       WHERE uo.userid = $1 OR o.createdBy = $1`, [userid]
    );

    res.json({ organisations: userOrgs.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* GET organisation details by orgId */
router.get('/:orgId', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;

    // Fetch organisation details
    const orgResult = await pool.query('SELECT * FROM organisations WHERE orgid = $1', [orgId]);
    if (orgResult.rows.length === 0) {
      return res.status(404).json({ error: "Organisation not found" });
    }
    const organisation = orgResult.rows[0];

    // Fetch users in the organisation
    const usersResult = await pool.query(
      `SELECT u.* FROM users u
       JOIN user_organisations uo ON u.userid = uo.userid
       WHERE uo.orgid = $1`, [orgId]
    );
    const users = usersResult.rows;

    // Respond with organisation details and users
    res.json({ 
      status: "success",
      message: "Organisation retrieved Successfully",
      data: {
        orgId: organisation.orgid,
        name: organisation.name,
        description: organisation.description,
        // createdBy: organisation.createdby
      }, 
      // users
     });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



/* POST create a new organisation */
router.post('/', authenticateToken, [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const { userid } = req.user;

    const newOrg = await pool.query(
      'INSERT INTO organisations (name, description, createdBy) VALUES ($1, $2, $3) RETURNING *',
      [name, description, userid]
    );

    await pool.query(
      'INSERT INTO user_organisations (userId, orgId) VALUES ($1, $2)',
      [userid, newOrg.rows[0].orgid]
    );

    res.status(201).json({ 
      status: "success",
      message: "Organisation retrieved Successfully",
      data: {
        orgId: newOrg.rows[0].orgid,
        name: newOrg.rows[0].name,
        description: newOrg.rows[0].description,
        // createdBy: newOrg.rows[0].createdby
      }, 
     });
  } catch (error) {
    res.status(400).json({ 
      status: "Bad request",
      // message: error.message,
      message: "Client error",
      statusCode: 400
    });
  }
});



/* POST add a user to an organisation */
router.post('/:orgId/users', authenticateToken, [
  body('userId').not().isEmpty().withMessage('UserId is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orgId } = req.params;
    const { userId } = req.body;

    await pool.query(
      'INSERT INTO user_organisations (userId, orgId) VALUES ($1, $2)',
      [userId, orgId]
    );

    res.status(201).json({ 
      status: "success",
      message: 'User added to the organisation successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
