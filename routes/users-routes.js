import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authorization.js';


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




router.delete('/', async (req, res) => {
  try {
    await pool.query('DELETE FROM users');
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;