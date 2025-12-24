import { executeQuery } from "../utils/db";

export default defineEventHandler(async (event) => {
  try {
    const personnel = await executeQuery(`
      SELECT id, name, gender, id_number, created_time, updated_time 
      FROM person 
      WHERE deleted_time IS NULL 
      ORDER BY created_time DESC
    `);

    return {
      success: true,
      data: personnel,
    };
  } catch (error) {
    console.error('Failed to fetch personnel list:', error);
    throw error;
  }
});
